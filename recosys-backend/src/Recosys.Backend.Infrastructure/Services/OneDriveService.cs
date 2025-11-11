using Azure.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Graph.Drives.Item.Items.Item.CreateLink;
using Microsoft.Graph.Drives.Item.Items.Item.CreateUploadSession;
using Microsoft.Graph.Models;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Services
{
    public class OneDriveService
    {
        private readonly GraphServiceClient _graphClient;
        private readonly string _uploadFolder = "RecosysOrders";
        private readonly string _cacheFilePath;

        public OneDriveService(IConfiguration config)
        {
            var clientId = config["OneDrive:ClientId"];
            var tenantId = config["OneDrive:TenantId"] ?? "common";
            var redirectUri = config["OneDrive:RedirectUri"] ?? "http://localhost";

            // Token cache directory
            var tokenCacheDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Recosys",
                "TokenCache");

            Directory.CreateDirectory(tokenCacheDir);
            _cacheFilePath = Path.Combine(tokenCacheDir, "onedrive_cache.bin");

            // Build public client (delegated auth for personal OneDrive)
            var pca = PublicClientApplicationBuilder.Create(clientId)
                .WithRedirectUri(redirectUri)
                .WithTenantId(tenantId)
                .Build();

            // Hook file-based token cache
            var cacheHelper = new MsalCacheHelper(_cacheFilePath);
            cacheHelper.Bind(pca.UserTokenCache);

            // Adapter to expose MSAL via Azure TokenCredential required by GraphServiceClient ctor
            var credential = new MsalPublicClientCredential(pca);

            // Initialize Graph client with required scopes
            _graphClient = new GraphServiceClient(credential, ["Files.ReadWrite", "User.Read", "offline_access"]);
        }

        /// <summary>
        /// Uploads a file stream to OneDrive inside "RecosysOrders" folder.
        /// Creates the folder if it doesn’t exist. Returns a shareable "view" link.
        /// </summary>
        public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
        {
            if (fileStream == null || fileStream.Length == 0)
                throw new ArgumentException("File stream cannot be empty.", nameof(fileStream));

            // Ensure folder exists in user's drive
            var drive = await _graphClient.Me.Drive.GetAsync();
            var driveId = drive?.Id ?? throw new InvalidOperationException("User drive not found.");

            await EnsureFolderExistsAsync(driveId);

            var uploadPath = $"{_uploadFolder}/{fileName}";

            // Create upload session — v5 requires passing a body model even if empty
            var uploadSession = await _graphClient
                .Drives[driveId]
                .Root
                .ItemWithPath(uploadPath)
                .CreateUploadSession
                .PostAsync(new CreateUploadSessionPostRequestBody());

            // Upload in chunks (LargeFileUploadTask handles chunking)
            var uploader = new LargeFileUploadTask<DriveItem>(uploadSession, fileStream);
            var uploadResult = await uploader.UploadAsync();

            if (uploadResult == null || uploadResult.ItemResponse == null)
                throw new Exception("Upload failed or returned no item.");

            // Create a shareable view link (use CreateLinkPostRequestBody model)
            var createLinkBody = new CreateLinkPostRequestBody { Type = "view" };

            var permission = await _graphClient
                .Drives[driveId]
                .Items[uploadResult.ItemResponse.Id]
                .CreateLink
                .PostAsync(createLinkBody);

            return permission?.Link?.WebUrl ?? string.Empty;
        }

        /// <summary>
        /// Ensures the target folder exists in the user's drive. Creates it if missing.
        /// Uses v5 SDK pattern (.Drives[driveId].Root.ItemWithPath(...).GetAsync()).
        /// </summary>
        private async Task EnsureFolderExistsAsync(string driveId)
        {
            try
            {
                // Try to get the folder by path (throws if missing)
                await _graphClient
                    .Drives[driveId]
                    .Root
                    .ItemWithPath(_uploadFolder)
                    .GetAsync();
            }
            catch
            {
                // Create folder under root if missing
                var folderToCreate = new DriveItem
                {
                    Name = _uploadFolder,
                    Folder = new Folder(),
                    AdditionalData = new Dictionary<string, object> { { "@microsoft.graph.conflictBehavior", "rename" } }
                };

                await _graphClient
                    .Drives[driveId]
                    .Items["root"]
                    .Children
                    .PostAsync(folderToCreate);
            }
        }


        // -------------------------
        // Token cache helper (MSAL)
        // -------------------------
        private class MsalCacheHelper(string cacheFile)
        {
            private readonly string _cacheFile = cacheFile;
            private readonly object _lock = new();

            public void Bind(ITokenCache tokenCache)
            {
                tokenCache.SetBeforeAccess(OnBeforeAccess);
                tokenCache.SetAfterAccess(OnAfterAccess);
            }

            private void OnBeforeAccess(TokenCacheNotificationArgs args)
            {
                lock (_lock)
                {
                    if (File.Exists(_cacheFile))
                    {
                        var data = File.ReadAllBytes(_cacheFile);
                        args.TokenCache.DeserializeMsalV3(data);
                    }
                }
            }

            private void OnAfterAccess(TokenCacheNotificationArgs args)
            {
                if (args.HasStateChanged)
                {
                    lock (_lock)
                    {
                        var data = args.TokenCache.SerializeMsalV3();
                        File.WriteAllBytes(_cacheFile, data);
                    }
                }
            }
        }

        // -------------------------------------------------------
        // Adapter: expose MSAL public client as an Azure TokenCredential
        // so GraphServiceClient can use it directly (v5 pattern)
        // -------------------------------------------------------
        private class MsalPublicClientCredential(IPublicClientApplication pca) : TokenCredential
        {
            private readonly IPublicClientApplication _pca = pca;
            private readonly string[] _scopes = new[] { "Files.ReadWrite", "User.Read", "offline_access" };

            public override AccessToken GetToken(TokenRequestContext requestContext, System.Threading.CancellationToken cancellationToken)
            {
                return GetTokenAsync(requestContext, cancellationToken).GetAwaiter().GetResult();
            }

            public override async ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, System.Threading.CancellationToken cancellationToken)
            {
                var accounts = await _pca.GetAccountsAsync();

                AuthenticationResult result;
                try
                {
                    // Try silent token acquisition first
                    result = await _pca.AcquireTokenSilent(_scopes, accounts.FirstOrDefault())
                        .ExecuteAsync(cancellationToken);
                }
                catch (MsalUiRequiredException)
                {
                    // Interactive login (first-run) - this will open a browser for you to sign in
                    result = await _pca.AcquireTokenInteractive(_scopes)
                        .ExecuteAsync(cancellationToken);
                }

                return new AccessToken(result.AccessToken, result.ExpiresOn);
            }
        }
    }
}
