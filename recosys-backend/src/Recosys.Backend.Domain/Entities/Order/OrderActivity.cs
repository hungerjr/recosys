using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recosys.Backend.Domain.Entities.Order
{
    public class OrderActivity
    {
        [Key]
        public int ActivityId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public OrderDetails Order { get; set; }

        [MaxLength(100)]
        public string Activity { get; set; }
    }
}
