using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Recosys.Backend.Application.DTOs.User;
using Recosys.Backend.Application.Interfaces.User;
using Recosys.Backend.Application.Services;
using Recosys.Backend.Domain.Entities.User;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Recosys.Backend.Api.Controllers.User
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IConfiguration configuration, IUserRepository userRepository, PasswordResetService passwordResetService) : ControllerBase
    {

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var user = await userRepository.GetByEmailAsync(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Invalid username or password.");

            // Include role in token
            var token = GenerateJwtToken(user);

            return Ok(new { Token = token });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            // Check if username already exists
            var existingUser = await userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
                return BadRequest("Username already exists.");

            // Hash password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new UserInfo
            {
                PasswordHash = hashedPassword,
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true,
                UserRoleId = 2
            };

            await userRepository.AddAsync(user);
            var success = await userRepository.SaveChangesAsync();

            if (!success)
                return StatusCode(500, "Could not create user.");

            return Ok("User registered successfully!");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var success = await passwordResetService.RequestPasswordResetAsync(email);
            if (!success) return NotFound("Email not found");
            return Ok("Reset link sent to your email.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var success = await passwordResetService.ResetPasswordAsync(dto.Token, dto.NewPassword);
            if (!success) return BadRequest("Invalid or expired token.");
            return Ok("Password reset successfully.");
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(email))
                return Unauthorized("Invalid token");

            var user = await userRepository.GetByEmailAsync(email);
            if (user == null)
                return NotFound("User not found");

            var userDto = new UserProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };

            return Ok(userDto);
        }

        private string GenerateJwtToken(UserInfo user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole?.Name ?? "User")
            };
            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(240),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
