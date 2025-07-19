using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Recosys.Backend.Application.Interfaces.User;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Services
{
    public class EmailService(IConfiguration configuration) : IEmailService
    {

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(configuration["EmailSettings:From"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = htmlBody };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(configuration["EmailSettings:SmtpServer"], int.Parse(configuration["EmailSettings:Port"]), true);
            await smtp.AuthenticateAsync(configuration["EmailSettings:Username"], configuration["EmailSettings:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
