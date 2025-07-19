using Recosys.Backend.Domain.Entities.User;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.User
{
    public interface IPasswordResetRepository
    {
        Task CreateTokenAsync(PasswordResetToken token);
        Task<PasswordResetToken> GetByTokenAsync(string token);
        Task<bool> SaveChangesAsync();
    }
}
