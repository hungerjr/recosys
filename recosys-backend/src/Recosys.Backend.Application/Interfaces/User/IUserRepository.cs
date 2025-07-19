using Recosys.Backend.Domain.Entities.User;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.User
{
    public interface IUserRepository
    {
        Task<UserInfo> GetByIdAsync(int id);
        Task<UserInfo> GetByEmailAsync(string email);
        Task AddAsync(UserInfo user);
        Task UpdateUserAsync(UserInfo user);
        Task DeleteUserAsync(int id);
        Task<bool> SaveChangesAsync();
    }
}
