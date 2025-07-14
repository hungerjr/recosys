using Recosys.Backend.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductDetails>> GetAllAsync();
        Task<ProductDetails> GetByIdAsync(int id);
        Task AddAsync(ProductDetails product);
        Task<bool> SaveChangesAsync();
    }
}
