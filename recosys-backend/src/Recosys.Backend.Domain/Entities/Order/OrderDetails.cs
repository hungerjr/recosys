using Recosys.Backend.Domain.Entities.Customer;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recosys.Backend.Domain.Entities.Order
{
    public class OrderDetails
    {
        [Key]
        public int Id { get; set; }

        public long ShiprocketId { get; set; }

        public long ChannelId { get; set; }

        [MaxLength(200)]
        public string ChannelName { get; set; }

        [MaxLength(50)]
        public string BaseChannelCode { get; set; }

        [MaxLength(100)]
        public string ChannelOrderId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public CustomerDetails Customer { get; set; }

        [MaxLength(100)]
        public string PickupLocation { get; set; }

        public decimal Total { get; set; }

        public int StatusCode { get; set; }

        [MaxLength(50)]
        public string PaymentMethod { get; set; }

        [MaxLength(200)]
        public string BrandName { get; set; }

        [MaxLength(100)]
        public string MarketplaceId { get; set; }

        public bool AllowReturn { get; set; }

        [MaxLength(500)]
        public string PickupExceptionReason { get; set; }

        public DateTime? ETDDate { get; set; }
        public DateTime? OutForDeliveryDate { get; set; }
        public DateTime? DeliveredDate { get; set; }

        [MaxLength(100)]
        public string InvoiceNo { get; set; }

        public DateTime? ChannelCreatedAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        public ICollection<OrderProduct> Products { get; set; }
        public ICollection<Shipment> Shipments { get; set; }
        public ICollection<OrderActivity> Activities { get; set; }
        public AWBData AWBData { get; set; }
    }
}
