using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recosys.Backend.Domain.Entities.Order
{
    public class Shipment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long ShipmentId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public OrderDetails Order { get; set; }

        [MaxLength(10)]
        public string ISDCode { get; set; }

        [MaxLength(200)]
        public string Courier { get; set; }

        [MaxLength(50)]
        public string CourierId { get; set; }

        public decimal? ShippingCharges { get; set; }
        public decimal Weight { get; set; }

        [MaxLength(100)]
        public string Dimensions { get; set; }

        public DateTime? ShippedDate { get; set; }
        public DateTime? PickupScheduledDate { get; set; }
        public DateTime? PickedupTimestamp { get; set; }

        [MaxLength(200)]
        public string PickupTokenNumber { get; set; }

        [MaxLength(100)]
        public string AWB { get; set; }

        [MaxLength(100)]
        public string RTOAWB { get; set; }

        [MaxLength(100)]
        public string ReturnAWB { get; set; }

        public decimal VolumetricWeight { get; set; }

        [MaxLength(500)]
        public string POD { get; set; }

        public DateTime? ETD { get; set; }

        [MaxLength(50)]
        public string SaralETD { get; set; }

        public DateTime? RTODeliveredDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public DateTime? RTOInitiatedDate { get; set; }

        [MaxLength(100)]
        public string WeightAction { get; set; }

        public int Status { get; set; }

        [MaxLength(100)]
        public string PickupId { get; set; }

        [MaxLength(200)]
        public string DeliveryExecutiveName { get; set; }

        [MaxLength(50)]
        public string DeliveryExecutiveNumber { get; set; }

        [MaxLength(500)]
        public string DelayReason { get; set; }

        public int ProductQuantity { get; set; }
        public decimal Total { get; set; }

        [MaxLength(100)]
        public string SubStatus { get; set; }

        public decimal Cost { get; set; }
        public DateTime? AWBAssignDate { get; set; }
    }
}
