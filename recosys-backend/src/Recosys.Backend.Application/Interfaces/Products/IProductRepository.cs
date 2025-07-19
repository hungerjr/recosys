using Recosys.Backend.Domain.Entities.Products;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.Products
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductDetails>> GetAllAsync();
        Task<ProductDetails> GetByIdAsync(int id);
        Task AddAsync(ProductDetails product);
        Task<bool> SaveChangesAsync();
    }
}
