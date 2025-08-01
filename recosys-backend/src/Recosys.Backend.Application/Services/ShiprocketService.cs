using Microsoft.Extensions.Configuration;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Application.Interfaces.ShipRocket;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Services
{
    public class ShiprocketService(HttpClient httpClient, IConfiguration config) : IShiprocketService
    {
        private string _token;

        private async Task LoginShiprocketAsync()
        {
            var email = config["Shiprocket:Email"];
            var password = config["Shiprocket:Password"];

            var loginPayload = new
            {
                email,
                password
            };

            var response = await httpClient.PostAsJsonAsync("https://apiv2.shiprocket.in/v1/external/auth/login", loginPayload);

            if (!response.IsSuccessStatusCode)
                throw new Exception("Shiprocket login failed");

            var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
            _token = result?.Token ?? throw new Exception("Invalid token from Shiprocket");

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
        }

        private async Task LogoutShiprocketAsync()
        {
            var logoutPayload = new { };
            var response = await httpClient.PostAsJsonAsync("https://apiv2.shiprocket.in/v1/external/auth/logout", logoutPayload);

            if (!response.IsSuccessStatusCode)
                Console.WriteLine("Shiprocket logout may have failed.");
        }

        public async Task<List<ShiprocketCustomerDto>> FetchAllShiprocketCustomersAsync()
        {
            await LoginShiprocketAsync();
            var allCustomers = new List<ShiprocketCustomerDto>();
            int page = 1;
            int pageSize = 50;
            try
            {
                while (true)
                {
                    var response = await httpClient.GetAsync(
                        $"https://apiv2.shiprocket.co/v1/customers/getallcustomers?page={page}&per_page={pageSize}");

                    if (!response.IsSuccessStatusCode) break;

                    var content = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ShiprocketApiResponse>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (result?.Data == null || result.Data.Count < pageSize)
                    {
                        if (result?.Data != null)
                            allCustomers.AddRange(result.Data);
                        break;
                    }

                    allCustomers.AddRange(result.Data);
                    page++;
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                await LogoutShiprocketAsync();
            }

            return allCustomers;
        }

        private class LoginResponse
        {
            public string Token { get; set; }
        }

        public class ShiprocketApiResponse
        {
            public List<ShiprocketCustomerDto> Data { get; set; }
        }
    }
}