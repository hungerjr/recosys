namespace Recosys.Backend.Application.DTOs.User
{
    public class ResetPasswordDto
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
