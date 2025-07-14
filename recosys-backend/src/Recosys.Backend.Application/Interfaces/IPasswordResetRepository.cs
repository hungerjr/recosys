using Recosys.Backend.Domain.Entities;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces
{
    public interface IPasswordResetRepository
    {
        Task CreateTokenAsync(PasswordResetToken token);
        Task<PasswordResetToken> GetByTokenAsync(string token);
        Task<bool> SaveChangesAsync();
    }
}
