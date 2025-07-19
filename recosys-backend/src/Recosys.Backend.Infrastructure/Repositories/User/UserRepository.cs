using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Infrastructure.Persistence;
using System.Threading.Tasks;
using Recosys.Backend.Domain.Entities.User;
using Recosys.Backend.Application.Interfaces.User;

namespace Recosys.Backend.Infrastructure.Repositories.User
{
    public class UserRepository(AppDbContext context) : IUserRepository
    {
        public async Task<UserInfo> GetByIdAsync(int id)
        {
            return await context.UserInfo.FindAsync(id);
        }
        public async Task<UserInfo> GetByEmailAsync(string email)
        {
            return await context.UserInfo.Include(u => u.UserRole)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddAsync(UserInfo user)
        {
            await context.UserInfo.AddAsync(user);
        }

        public async Task UpdateUserAsync(UserInfo user)
        {
            context.UserInfo.Update(user);
            await context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await context.UserInfo.FindAsync(id);
            if (user != null)
            {
                context.UserInfo.Remove(user);
                await context.SaveChangesAsync();
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
