using ReCoSys.ECommerce.Domain.Entities;
using System.Threading.Tasks;

namespace ReCoSys.ECommerce.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<UserInfo> GetByUsernameAsync(string username);
        Task<UserInfo> GetByIdAsync(int id);
        Task<UserInfo> GetByEmailAsync(string email);
        Task AddAsync(UserInfo user);
        Task UpdateUserAsync(UserInfo user);
        Task DeleteUserAsync(int id);
        Task<bool> SaveChangesAsync();
    }
}
