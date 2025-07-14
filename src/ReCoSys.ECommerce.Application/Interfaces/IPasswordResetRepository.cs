using ReCoSys.ECommerce.Domain.Entities;
using System.Threading.Tasks;

namespace ReCoSys.ECommerce.Application.Interfaces
{
    public interface IPasswordResetRepository
    {
        Task CreateTokenAsync(PasswordResetToken token);
        Task<PasswordResetToken> GetByTokenAsync(string token);
        Task<bool> SaveChangesAsync();
    }
}
