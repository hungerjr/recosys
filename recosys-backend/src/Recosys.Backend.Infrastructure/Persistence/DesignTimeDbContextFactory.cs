using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Recosys.Backend.Infrastructure.Persistence
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            // Move up one folder, then into Api project
            var basePath = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())!.FullName, "Recosys.Backend.Api");
            var settingsPath = Path.Combine(basePath, "appsettings.json");

            if (!File.Exists(settingsPath))
            {
                throw new FileNotFoundException($"appsettings.json not found at {settingsPath}");
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
