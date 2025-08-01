using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Application.Interfaces.Customer;
using Recosys.Backend.Domain.Entities.Customer;
using Recosys.Backend.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Repositories.Customer
{
    public class CustomerAddressRepository(AppDbContext context) : ICustomerAddressRepository
    {
        public async Task<IEnumerable<CustomerAddress>> GetAllAsync(int customerId)
        {
            return await context.CustomerAddresses
                .Where(a => a.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<CustomerAddress?> GetByIdAsync(int id)
        {
            return await context.CustomerAddresses.FindAsync(id);
        }

        public async Task<CustomerAddress?> GetDefaultAddressAsync(int customerId)
        {
            return await context.CustomerAddresses
                .FirstOrDefaultAsync(a => a.CustomerId == customerId && a.IsDefault);
        }

        public async Task<bool> SetDefaultAddressAsync(int addressId, int customerId)
        {
            var addressToSet = await context.CustomerAddresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.CustomerId == customerId);

            if (addressToSet == null)
                return false;

            // Unset other default addresses for the customer
            var currentDefaults = await context.CustomerAddresses
                .Where(a => a.CustomerId == customerId && a.IsDefault && a.Id != addressId)
                .ToListAsync();

            foreach (var addr in currentDefaults)
            {
                addr.IsDefault = false;
            }

            // Set the selected address as default
            addressToSet.IsDefault = true;

            await context.SaveChangesAsync();
            return true;
        }

        public async Task AddAsync(CustomerAddress address)
        {
            // Ensure only one default address per customer
            if (address.IsDefault)
            {
                var existingDefaults = context.CustomerAddresses
                    .Where(a => a.CustomerId == address.CustomerId && a.IsDefault);

                foreach (var defaultAddress in existingDefaults)
                {
                    defaultAddress.IsDefault = false;
                }
            }

            await context.CustomerAddresses.AddAsync(address);
        }

        public async Task UpdateAsync(CustomerAddress address)
        {
            if (address.IsDefault)
            {
                var existingDefaults = context.CustomerAddresses
                    .Where(a => a.CustomerId == address.CustomerId && a.Id != address.Id && a.IsDefault);

                foreach (var defaultAddress in existingDefaults)
                {
                    defaultAddress.IsDefault = false;
                }
            }

            context.CustomerAddresses.Update(address);
        }

        public async Task DeleteAsync(int id)
        {
            var address = await context.CustomerAddresses.FindAsync(id);
            if (address != null)
            {
                context.CustomerAddresses.Remove(address);
            }
        }

        public async Task DeleteAllByCustomerIdAsync(int customerId)
        {
            var addresses = await context.CustomerAddresses
                .Where(a => a.CustomerId == customerId)
                .ToListAsync();

            context.CustomerAddresses.RemoveRange(addresses);
            await context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}
