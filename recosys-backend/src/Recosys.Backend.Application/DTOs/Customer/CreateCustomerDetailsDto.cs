namespace Recosys.Backend.Application.DTOs.Customer
{
    public class CreateCustomerDetailsDto
    {
        public string FullName { get; set; }
        public CreateCustomerAddressDto? Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
