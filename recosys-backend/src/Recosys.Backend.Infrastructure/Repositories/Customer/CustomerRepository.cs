using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Application.Interfaces.Customer;
using Recosys.Backend.Domain.Entities.Customer;
using Recosys.Backend.Infrastructure.Persistence;
using System.Collections.Generic;
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

        public async Task<CustomerDetails> GetByIdAsync(int id)
        {
            return await context.CustomerDetails
                .Include(c => c.Addresses)
                .FirstOrDefaultAsync(c => c.Id == id);
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
            var customer = await GetByIdAsync(id);
            if (customer != null)
            {
                context.CustomerDetails.Remove(customer);
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
