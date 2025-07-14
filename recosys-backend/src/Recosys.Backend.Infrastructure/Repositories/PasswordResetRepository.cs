using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Infrastructure.Persistence;
using Recosys.Backend.Application.Interfaces;
using Recosys.Backend.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Repositories
{
    public class PasswordResetRepository : IPasswordResetRepository
    {
        private readonly AppDbContext _context;
        public PasswordResetRepository(AppDbContext context)
        {
            _context = context;
        }

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
