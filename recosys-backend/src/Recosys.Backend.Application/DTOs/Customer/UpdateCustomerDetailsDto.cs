﻿namespace Recosys.Backend.Application.DTOs.Customer
{
    public class UpdateCustomerDetailsDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
