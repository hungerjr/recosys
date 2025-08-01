using System.Collections.Generic;
using System.Threading.Tasks;
using Recosys.Backend.Domain.Entities.Customer;

namespace Recosys.Backend.Application.Interfaces.Customer
{    public interface ICustomerAddressRepository
    {
        Task<IEnumerable<CustomerAddress>> GetAllAsync(int customerId);
        Task<CustomerAddress?> GetByIdAsync(int id);
        Task<CustomerAddress?> GetDefaultAddressAsync(int customerId);
        Task<bool> SetDefaultAddressAsync(int addressId, int customerId);
        Task AddAsync(CustomerAddress address);
        Task UpdateAsync(CustomerAddress address);
        Task DeleteAsync(int id);
        Task DeleteAllByCustomerIdAsync(int customerId);
        Task SaveChangesAsync();
    }
}
