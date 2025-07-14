using ReCoSys.ECommerce.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReCoSys.ECommerce.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductDetails>> GetAllAsync();
        Task<ProductDetails> GetByIdAsync(int id);
        Task AddAsync(ProductDetails product);
        Task<bool> SaveChangesAsync();
    }
}
