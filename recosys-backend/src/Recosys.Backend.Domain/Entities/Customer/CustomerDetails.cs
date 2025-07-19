using System;
using System.ComponentModel.DataAnnotations;

namespace Recosys.Backend.Domain.Entities.Customer
{
    public class CustomerDetails
    {
        [Key]
        public int Id { get; set; } // Primary Key
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
