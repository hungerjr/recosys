using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Infrastructure.Persistence;
using Recosys.Backend.Application.Interfaces;
using Recosys.Backend.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Repositories
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
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
