using System;

namespace Recosys.Backend.Application.DTOs.Order
{
    public class ShipmentDto
    {
        public long ShipmentId { get; set; }

        public string IsdCode { get; set; }

        public string Courier { get; set; }

        public string CourierId { get; set; }

        public string Awb { get; set; }

        public decimal Weight { get; set; }

        public string Dimensions { get; set; }

        public DateTime? DeliveredDate { get; set; }

        public int Status { get; set; }

        public decimal Total { get; set; }

        public decimal Cost { get; set; }
    }
}
