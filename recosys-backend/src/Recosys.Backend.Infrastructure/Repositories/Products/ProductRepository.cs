using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Threading.Tasks;
using Recosys.Backend.Domain.Entities.Products;
using Recosys.Backend.Application.Interfaces.Products;

namespace Recosys.Backend.Infrastructure.Repositories.Products
{
    public class ProductRepository(AppDbContext context) : IProductRepository
    {
        public async Task<IEnumerable<ProductDetails>> GetAllAsync()
        {
            return await context.Products.ToListAsync();
        }

        public async Task<ProductDetails> GetByIdAsync(int id)
        {
            return await context.Products.FindAsync(id);
        }

        public async Task AddAsync(ProductDetails product)
        {
            await context.Products.AddAsync(product);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
