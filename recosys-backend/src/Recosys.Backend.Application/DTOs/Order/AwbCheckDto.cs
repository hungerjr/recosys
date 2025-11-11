using System;

namespace Recosys.Backend.Application.DTOs.Order
{
    public class AwbCheckDto
    {
        public string? ProductName { get; set; }
        public string? AWB { get; set; }
        public string? Courier { get; set; }
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
