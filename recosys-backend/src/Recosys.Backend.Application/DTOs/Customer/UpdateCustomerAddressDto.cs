namespace Recosys.Backend.Application.DTOs.Customer
{
    public class UpdateCustomerAddressDto
    {
        public int Id { get; set; }  // Required for identifying the address to update

        public string Address { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;

        public string Pincode { get; set; } = string.Empty;

        public bool IsDefault { get; set; } = false;
    }
}
