using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using ReCoSys.ECommerce.Application.Interfaces;
using System.Threading.Tasks;

namespace ReCoSys.ECommerce.Infrastructure.Services
{
    public class EmailService(IConfiguration config) : IEmailService
    {
        private readonly IConfiguration _configuration = config;

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_configuration["EmailSettings:From"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = htmlBody };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_configuration["EmailSettings:SmtpServer"], int.Parse(_configuration["EmailSettings:Port"]), true);
            await smtp.AuthenticateAsync(_configuration["EmailSettings:Username"], _configuration["EmailSettings:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
