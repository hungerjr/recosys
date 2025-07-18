using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Infrastructure.Persistence;
using Recosys.Backend.Application.Interfaces;
using Recosys.Backend.Domain.Entities;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserInfo> GetByIdAsync(int id)
        {
            return await _context.UserInfo.FindAsync(id);
        }
        public async Task<UserInfo> GetByEmailAsync(string email)
        {
            return await _context.UserInfo.Include(u => u.UserRole)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddAsync(UserInfo user)
        {
            await _context.UserInfo.AddAsync(user);
        }

        public async Task UpdateUserAsync(UserInfo user)
        {
            _context.UserInfo.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.UserInfo.FindAsync(id);
            if (user != null)
            {
                _context.UserInfo.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
