using Recosys.Backend.Application.Common.Models;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Domain.Entities.Customer;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.Customer
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<CustomerDetails>> GetAllAsync();
         Task<PagedResult<CustomerDetails>> GetPagedWithDefaultAddressAsync(int pageNumber, int pageSize, string? sortBy, string? sortOrder, string? nameFilter, string? emailFilter, string? phoneFilter);
        Task<CustomerDetails> GetByIdAsync(int id);
        Task AddAsync(CustomerDetails customer);
        Task<CustomerDetails?> FindByEmailOrPhoneAsync(string email, string phone);
        Task UpdateAsync(CustomerDetails customer);
        Task DeleteAsync(int id);
        Task<bool> SaveChangesAsync();
        Task<int> BulkInsertCustomersAsync(List<ShiprocketCustomerDto> customerDtos);
    }
}
