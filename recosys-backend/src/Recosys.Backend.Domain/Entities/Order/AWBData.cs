using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recosys.Backend.Domain.Entities.Order
{
    public class AWBData
    {
        [Key]
        public int AWBDataId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public OrderDetails Order { get; set; }

        [MaxLength(50)]
        public string Zone { get; set; }

        public decimal? CODCharges { get; set; }
        public decimal AppliedWeightAmount { get; set; }
        public decimal FreightCharges { get; set; }
        public decimal AppliedWeight { get; set; }
        public decimal ChargedWeight { get; set; }
        public decimal ChargedWeightAmount { get; set; }
        public decimal ChargedWeightAmountRTO { get; set; }
        public decimal AppliedWeightAmountRTO { get; set; }
        public decimal BillingAmount { get; set; }

        [MaxLength(100)]
        public string ServiceTypeId { get; set; }
    }
}
