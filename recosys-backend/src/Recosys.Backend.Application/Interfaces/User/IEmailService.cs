using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.User
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);
    }

}
