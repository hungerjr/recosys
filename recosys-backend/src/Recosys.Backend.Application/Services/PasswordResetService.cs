using Recosys.Backend.Application.Interfaces.User;
using Recosys.Backend.Domain.Entities.User;
using System;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Services
{
    public class PasswordResetService(IUserRepository userRepository, IPasswordResetRepository resetRepository, IEmailService emailSender)
    {
        public async Task<bool> RequestPasswordResetAsync(string email)
        {
            var user = await userRepository.GetByEmailAsync(email);
            if (user == null) return false;

            var token = Guid.NewGuid().ToString();
            var expiry = DateTime.UtcNow.AddHours(1);

            var resetToken = new PasswordResetToken
            {
                Token = token,
                UserInfoId = user.Id,
                ExpiryDate = expiry,
                IsUsed = false
            };

            await resetRepository.CreateTokenAsync(resetToken);
            await resetRepository.SaveChangesAsync();

            var resetLink = $"https://recosys.in/reset-password?token={token}";
            var message = $"Click the link to reset your password: {resetLink}";

            await emailSender.SendEmailAsync(user.Email, "Password Reset Request", message);
            return true;
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var resetToken = await resetRepository.GetByTokenAsync(token);
            if (resetToken == null) return false;

            resetToken.IsUsed = true;
            resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            return await resetRepository.SaveChangesAsync();
        }
    }

}
