using Microsoft.Extensions.Configuration;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Application.DTOs.Shiprocket;
using Recosys.Backend.Application.Interfaces.ShipRocket;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Services
{
    public class ShiprocketService(HttpClient httpClient, IConfiguration config) : IShiprocketService
    {
        private string _token;

        public async Task<List<ShiprocketCustomerDto>> FetchAllShiprocketCustomersAsync()
        {
            await LoginShiprocketPortalAsync();
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
                    var result = JsonSerializer.Deserialize<ShiprocketCustomerApiResponse>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    if (result?.Data == null || result.Data.Count < pageSize)
                    {
                        if (result?.Data != null)
                        {
                            await PopulateMissingMobileNumbersAsync(result.Data);
                            allCustomers.AddRange(result.Data);
                        }
                        break;
                    }
                    await PopulateMissingMobileNumbersAsync(result.Data);
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
                await LogoutShiprocketPortalAsync();
            }

            return allCustomers;
        }

        public async Task<List<ShiprocketOrderDto>> FetchOrdersAsync()
        {
            await LoginShiprocketPortalAsync(false);
            var allOrders = new List<ShiprocketOrderDto>();
            int page = 1;
            int pageSize = 50;
            try
            {
                while (true)
                {
                    var response = await httpClient.GetAsync(
                        $"https://apiv2.shiprocket.in/v1/external/orders?page={page}&per_page={pageSize}");

                    if (!response.IsSuccessStatusCode) break;

                    var content = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ShiprocketOrdersResponse>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    if (result?.Data == null || result.Data.Count < pageSize)
                    {
                        if (result?.Data != null)
                        {
                            allOrders.AddRange(result.Data);
                        }
                        break;
                    }
                    allOrders.AddRange(result.Data);
                    page++;
                }
            }
            catch (Exception)
            {

            }
            finally
            {
                await LogoutShiprocketPortalAsync();
            }
            return allOrders;
        }

        private async Task LoginShiprocketPortalAsync(bool isPortalLogin = true)
        {
            var email = isPortalLogin ? config["Shiprocket:Email"] : config["ShiprocketApi:Email"];
            var password = isPortalLogin ? config["Shiprocket:Password"] : config["ShiprocketApi:Password"];

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

        private async Task LogoutShiprocketPortalAsync()
        {
            var logoutPayload = new { };
            var response = await httpClient.PostAsJsonAsync("https://apiv2.shiprocket.in/v1/external/auth/logout", logoutPayload);

            if (!response.IsSuccessStatusCode)
                Console.WriteLine("Shiprocket logout may have failed.");
        }

        private async Task PopulateMissingMobileNumbersAsync(List<ShiprocketCustomerDto> customers)
        {
            try
            {
                foreach (var customer in customers)
                {
                    if (string.IsNullOrEmpty(customer.Mobile))
                    {
                        customer.Mobile = await GetCustomerMobileFromShiprocket(customer.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private async Task<string> GetCustomerMobileFromShiprocket(string customerId)
        {
            try
            {
                var response = await httpClient.GetAsync(
                        $"https://apiv2.shiprocket.co/v1/customers/getcustomer/{customerId}");

                if (!response.IsSuccessStatusCode) return string.Empty;

                var content = await response.Content.ReadAsStringAsync();

                using var jsonDoc = JsonDocument.Parse(content);
                var root = jsonDoc.RootElement;

                var mobile = root
                    .GetProperty("customer")
                    .GetProperty("details")
                    .GetProperty("mobile_no")
                    .GetString();

                return mobile;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private class LoginResponse
        {
            public string Token { get; set; }
        }

        public class ShiprocketCustomerApiResponse
        {
            public List<ShiprocketCustomerDto> Data { get; set; }
        }

        public class ShiprocketOrdersResponse
        {
            [JsonPropertyName("data")]
            public List<ShiprocketOrderDto> Data { get; set; }

            [JsonPropertyName("meta")]
            public object Meta { get; set; } // you can create a proper DTO if you need meta info
        }
    }
}