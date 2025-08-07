using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Application.Common.Models;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Application.Interfaces.Customer;
using Recosys.Backend.Domain.Entities.Customer;
using Recosys.Backend.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Repositories.Customer
{
    public class CustomerRepository(AppDbContext context) : ICustomerRepository
    {
        public async Task<IEnumerable<CustomerDetails>> GetAllAsync()
        {
            return await context.CustomerDetails
                .Include(c => c.Addresses)
                .ToListAsync();
        }

        public async Task<PagedResult<CustomerDetails>> GetPagedWithDefaultAddressAsync(
                int pageNumber, int pageSize,
                string? sortBy, string? sortOrder, string? nameFilter, string? emailFilter, string? phoneFilter)
        {
            using var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            var skip = (pageNumber - 1) * pageSize;
            var take = pageSize;

            var sql = @"SELECT 
                            c.Id AS CustomerId, c.FullName, c.Email, c.Phone, c.CreatedAt, c.UpdatedAt,
                            a.Id AS AddressId, a.Address, a.City, a.State, a.Country, a.Pincode
                        FROM CustomerDetails c
                        LEFT JOIN CustomerAddresses a ON c.Id = a.CustomerId AND a.IsDefault = 1
                        WHERE 
                            (@name IS NULL OR c.FullName LIKE @name + '%') AND
                            (@email IS NULL OR c.Email LIKE @email + '%') AND
                            (@phone IS NULL OR c.Phone LIKE @phone + '%')
                        ORDER BY
                            CASE WHEN @sortBy = 'name' AND @sortOrder = 'asc' THEN c.FullName END ASC,
                            CASE WHEN @sortBy = 'name' AND @sortOrder = 'desc' THEN c.FullName END DESC,
                            CASE WHEN @sortBy = 'email' AND @sortOrder = 'asc' THEN c.Email END ASC,
                            CASE WHEN @sortBy = 'email' AND @sortOrder = 'desc' THEN c.Email END DESC,
                            CASE WHEN @sortBy = 'phone' AND @sortOrder = 'asc' THEN c.Phone END ASC,
                            CASE WHEN @sortBy = 'phone' AND @sortOrder = 'desc' THEN c.Phone END DESC,
                            c.Id DESC
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY;

                        SELECT COUNT(*) 
                        FROM CustomerDetails c
                        WHERE 
                            (@name IS NULL OR c.FullName LIKE @name + '%') AND
                            (@email IS NULL OR c.Email LIKE @email + '%') AND
                            (@phone IS NULL OR c.Phone LIKE @phone + '%'); ";

            using var command = connection.CreateCommand();
            command.CommandText = sql;

            var parameters = new[]
            {
                CreateParam(command, "@name", nameFilter),
                CreateParam(command, "@email", emailFilter),
                CreateParam(command, "@phone", phoneFilter),
                CreateParam(command, "@sortBy", sortBy ?? "id"),
                CreateParam(command, "@sortOrder", sortOrder ?? "asc"),
                CreateParam(command, "@skip", skip),
                CreateParam(command, "@take", take)
            };

            foreach (var p in parameters)
                command.Parameters.Add(p);

            var customers = new List<CustomerDetails>();
            int totalCount = 0;

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var customer = new CustomerDetails
                {
                    Id = reader.GetInt32(0),
                    FullName = reader.GetString(1),
                    Email = reader.GetString(2),
                    Phone = reader.GetString(3),
                    CreatedAt = reader.GetDateTime(4),
                    UpdatedAt = reader.GetDateTime(5),
                    Addresses = []
                };

                if (!reader.IsDBNull(6)) // AddressId
                {
                    var address = new CustomerAddress
                    {
                        Id = reader.GetInt32(6),
                        Address = reader.IsDBNull(7) ? "" : reader.GetString(7),
                        City = reader.IsDBNull(8) ? "" : reader.GetString(8),
                        State = reader.IsDBNull(9) ? "" : reader.GetString(9),
                        Country = reader.IsDBNull(10) ? "" : reader.GetString(10),
                        Pincode = reader.IsDBNull(11) ? "" : reader.GetString(11),
                        CustomerId = customer.Id
                    };
                    customer.DefaultAddress = address;
                }

                customers.Add(customer);
            }

            if (await reader.NextResultAsync() && await reader.ReadAsync())
            {
                totalCount = reader.GetInt32(0);
            }

            return new PagedResult<CustomerDetails>(customers, totalCount, pageNumber, pageSize);
        }

        private static DbParameter CreateParam(DbCommand command, string name, object? value)
        {
            var param = command.CreateParameter();
            param.ParameterName = name;
            param.Value = value ?? DBNull.Value;
            return param;
        }


        public async Task<CustomerDetails> GetByIdAsync(int id)
        {
            var customer = await context.CustomerDetails
                                        .Include(c => c.Addresses)
                                        .FirstOrDefaultAsync(c => c.Id == id);

            if (customer != null)
            {
                customer.DefaultAddress = customer.Addresses.FirstOrDefault(a => a.IsDefault);
            }

            return customer;
        }

        public async Task AddAsync(CustomerDetails customer)
        {
            await context.CustomerDetails.AddAsync(customer);
        }

        public async Task<CustomerDetails?> FindByEmailOrPhoneAsync(string email, string phone)
        {
            return await context.CustomerDetails
                .Include(c => c.Addresses)
                .FirstOrDefaultAsync(c => c.Email == email || c.Phone == phone);
        }

        public async Task UpdateAsync(CustomerDetails customer)
        {
            context.CustomerDetails.Update(customer);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                // Step 1: Delete all addresses linked to the customer
                var addresses = await context.CustomerAddresses
                    .Where(a => a.CustomerId == id)
                    .ToListAsync();

                if (addresses.Count != 0)
                {
                    context.CustomerAddresses.RemoveRange(addresses);
                }

                // Step 2: Delete the customer
                var customer = await context.CustomerDetails.FindAsync(id);
                if (customer != null)
                {
                    context.CustomerDetails.Remove(customer);
                }

                // Step 3: Save and commit
                await context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<(int insertedCount, List<string> skippedFromJson, List<string> skippedFromDb)> BulkInsertCustomersAsync(List<ShiprocketCustomerDto> customerDtos)
        {
            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                // 1. Separate entries with and without phone numbers
                var entriesWithPhone = customerDtos
                    .Where(c => !string.IsNullOrWhiteSpace(c.Mobile))
                    .ToList();

                var entriesWithoutPhone = customerDtos
                    .Where(c => string.IsNullOrWhiteSpace(c.Mobile))
                    .ToList();

                // 2a. Remove duplicate phone numbers (keep first)
                var deduplicatedByPhone = entriesWithPhone
                    .GroupBy(c => c.Mobile)
                    .Select(g => g.First())
                    .ToList();

                var skippedFromJson = entriesWithPhone
                    .GroupBy(c => c.Mobile)
                    .Where(g => g.Count() > 1)
                    .Select(g => g.Key)
                    .ToList();

                // 2b. Remove duplicate emails (keep first)
                var deduplicatedByEmail = deduplicatedByPhone
                    .GroupBy(c => c.Email?.Trim().ToLower())
                    .Select(g => g.First())
                    .ToList();

                // 3. Remove existing phone numbers from DB
                var existingPhones = await context.CustomerDetails
                    .Where(c => deduplicatedByEmail.Select(x => x.Mobile).Contains(c.Phone))
                    .Select(c => c.Phone)
                    .ToListAsync();

                var toInsertWithPhone = deduplicatedByEmail
                    .Where(c => !existingPhones.Contains(c.Mobile))
                    .ToList();

                var skippedFromDb = existingPhones;

                // 4. Combine with entries without phone
                var combinedList = toInsertWithPhone.Concat(entriesWithoutPhone).ToList();

                // 5. Filter out entries already in DB based on composite key match
                var customersInDb = await context.CustomerDetails
                    .Include(c => c.Addresses)
                    .ToListAsync();

                var toInsertFinal = new List<ShiprocketCustomerDto>();

                foreach (var dto in combinedList)
                {
                    var fullName = $"{dto.Fname?.Trim()} {dto.Lname?.Trim()}".Trim().ToLower();
                    var address = dto.Address?.Trim().ToLower();
                    var city = dto.City?.Trim().ToLower();
                    var state = dto.State?.Trim().ToLower();
                    var pincode = dto.Pincode?.Trim().ToLower();

                    bool exists = customersInDb.Any(c =>
                        c.FullName.ToLower().Contains(fullName) &&
                        c.Addresses.Any(a =>
                            (a.Address?.ToLower().Contains(address) ?? false) &&
                            (a.City?.ToLower().Contains(city) ?? false) &&
                            (a.State?.ToLower().Contains(state) ?? false) &&
                            (a.Pincode?.ToLower().Contains(pincode) ?? false)
                        ));

                    if (!exists)
                    {
                        toInsertFinal.Add(dto);
                    }
                }

                // 6. Insert new customers
                var customers = new List<CustomerDetails>();
                foreach (var dto in toInsertFinal)
                {
                    var fullName = $"{dto.Fname?.Trim()} {dto.Lname?.Trim()}".Trim();
                    var customer = new CustomerDetails
                    {
                        FullName = fullName,
                        Email = dto.Email,
                        Phone = dto.Mobile,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        Addresses =
                        [
                            new CustomerAddress
                    {
                        Address = dto.Address,
                        Pincode = dto.Pincode,
                        City = dto.City,
                        State = dto.State,
                        Country = "India",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsDefault = true
                    }
                        ]
                    };
                    customers.Add(customer);
                }

                if (customers.Count > 0)
                {
                    await context.CustomerDetails.AddRangeAsync(customers);
                    await context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return (customers.Count, skippedFromJson, skippedFromDb);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}