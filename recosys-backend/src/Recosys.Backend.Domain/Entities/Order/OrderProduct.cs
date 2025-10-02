using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recosys.Backend.Domain.Entities.Order
{
    public class OrderProduct
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long ProductLineId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public OrderDetails Order { get; set; }

        [MaxLength(100)]
        public string ChannelOrderProductId { get; set; }

        [MaxLength(500)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string ChannelSKU { get; set; }

        public int Quantity { get; set; }
        public long ProductId { get; set; }
        public int Available { get; set; }
        public decimal Price { get; set; }
        public decimal ProductCost { get; set; }    

        [MaxLength(50)]
        public string HSN { get; set; }

        public decimal Discount { get; set; }
        public decimal DiscountIncludingTax { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal MRP { get; set; }
        public decimal TaxPercentage { get; set; }
        public string Description { get; set; }
    }
}
