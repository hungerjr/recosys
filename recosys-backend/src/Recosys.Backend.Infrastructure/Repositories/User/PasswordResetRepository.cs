using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Infrastructure.Persistence;
using System;
using System.Threading.Tasks;
using Recosys.Backend.Domain.Entities.User;
using Recosys.Backend.Application.Interfaces.User;

namespace Recosys.Backend.Infrastructure.Repositories.User
{
    public class PasswordResetRepository(AppDbContext context) : IPasswordResetRepository
    {
        private readonly AppDbContext _context = context;

        public async Task CreateTokenAsync(PasswordResetToken token)
        {
            await _context.PasswordResetTokens.AddAsync(token);
        }

        public async Task<PasswordResetToken> GetByTokenAsync(string token)
        {
            return await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == token && !t.IsUsed && t.ExpiryDate > DateTime.UtcNow);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }

}
