using System.Threading.Tasks;

namespace ReCoSys.ECommerce.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);
    }

}
