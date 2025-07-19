using Recosys.Backend.Domain.Entities.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.Customer
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<CustomerDetails>> GetAllAsync();
        Task<CustomerDetails> GetByIdAsync(int id);
        Task AddAsync(CustomerDetails customer);
        Task<CustomerDetails?> FindByEmailOrPhoneAsync(string email, string phone);
        Task UpdateAsync(CustomerDetails customer);
        Task DeleteAsync(int id);
        Task<bool> SaveChangesAsync();
    }
}
