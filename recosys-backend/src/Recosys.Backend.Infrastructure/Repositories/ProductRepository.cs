using Microsoft.EntityFrameworkCore;
using ReCoSys.ECommerce.Application.Interfaces;
using ReCoSys.ECommerce.Domain.Entities;
using ReCoSys.ECommerce.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReCoSys.ECommerce.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDetails>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<ProductDetails> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task AddAsync(ProductDetails product)
        {
            await _context.Products.AddAsync(product);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
    }
}
