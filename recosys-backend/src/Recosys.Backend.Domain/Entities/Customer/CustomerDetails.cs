using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Recosys.Backend.Domain.Entities.Customer
{
    public class CustomerDetails
    {
        [Key]
        public int Id { get; set; } // Primary Key
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [NotMapped]
        public CustomerAddress? DefaultAddress => Addresses?.FirstOrDefault(a => a.IsDefault);

        //Navigation Property
        public ICollection<CustomerAddress> Addresses { get; set; } = [];
    }
}
