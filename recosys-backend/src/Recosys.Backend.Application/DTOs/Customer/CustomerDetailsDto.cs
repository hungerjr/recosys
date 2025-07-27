using System;

namespace Recosys.Backend.Application.DTOs.Customer
{
    public class CustomerDetailsDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public CustomerAddressDto? DefaultAddress { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
