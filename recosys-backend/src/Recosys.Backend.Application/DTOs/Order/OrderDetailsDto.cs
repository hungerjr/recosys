using System;
using System.Collections.Generic;

namespace Recosys.Backend.Application.DTOs.Order
{
    public class OrderDetailsDto
    {
        public int Id { get; set; }
        public long ShiprocketId { get; set; }
        public int CustomerId { get; set; }
        public string ChannelOrderId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public decimal Total { get; set; }
        public string PaymentMethod { get; set; }
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public List<OrderProductDto> Products { get; set; } = [];
        public List<ShipmentDto> Shipments { get; set; } = [];
        public List<OrderActivityDto> Activities { get; set; } = [];
        public AwbDataDto AwbData { get; set; }
    }
}
