using Recosys.Backend.Application.Interfaces;
using Recosys.Backend.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Services
{
    public class PasswordResetService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordResetRepository _resetRepository;
        private readonly IEmailService _emailSender;

        public PasswordResetService(IUserRepository userRepository, IPasswordResetRepository resetRepository, IEmailService emailSender)
        {
            _userRepository = userRepository;
            _resetRepository = resetRepository;
            _emailSender = emailSender;
        }

        public async Task<bool> RequestPasswordResetAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
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

            await _resetRepository.CreateTokenAsync(resetToken);
            await _resetRepository.SaveChangesAsync();

            var resetLink = $"https://recosys.in/reset-password?token={token}";
            var message = $"Click the link to reset your password: {resetLink}";

            await _emailSender.SendEmailAsync(user.Email, "Password Reset Request", message);
            return true;
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var resetToken = await _resetRepository.GetByTokenAsync(token);
            if (resetToken == null) return false;

            resetToken.IsUsed = true;
            resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            return await _resetRepository.SaveChangesAsync();
        }
    }

}
