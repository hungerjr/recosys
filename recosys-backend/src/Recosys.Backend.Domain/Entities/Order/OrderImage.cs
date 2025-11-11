using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recosys.Backend.Domain.Entities.Order
{
    public class OrderImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        public string FileName { get; set; }

        public string CloudUrl { get; set; }

        public DateTime UploadedAt { get; set; }

        [ForeignKey("OrderId")]
        public OrderDetails Order { get; set; }
    }

}
