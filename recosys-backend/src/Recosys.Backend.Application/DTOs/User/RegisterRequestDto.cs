namespace Recosys.Backend.Application.DTOs.User
{
    public class RegisterRequestDto
    {
        public string Password { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
