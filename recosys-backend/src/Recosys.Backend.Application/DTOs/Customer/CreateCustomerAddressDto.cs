namespace Recosys.Backend.Application.DTOs.Customer
{
    public class CreateCustomerAddressDto
    {
        public int CustomerId { get; set; }

        public string Address { get; set; }

        public string City { get; set; }
        public string State { get; set; }

        public string Pincode { get; set; }
        public string Country { get; set; }

        public bool IsDefault { get; set; }
    }
}
