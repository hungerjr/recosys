namespace Recosys.Backend.Application.DTOs.Order
{
    public class OrderProductDto
    {
        public long ProductLineId { get; set; }

        public string ChannelOrderProductId { get; set; }

        public string Name { get; set; }

        public string ChannelSku { get; set; }

        public int Quantity { get; set; }

        public long ProductId { get; set; }

        public int Available { get; set; }

        public decimal Price { get; set; }

        public decimal ProductCost { get; set; }

        public string Hsn { get; set; }

        public decimal Discount { get; set; }

        public decimal DiscountIncludingTax { get; set; }

        public decimal SellingPrice { get; set; }

        public decimal Mrp { get; set; }

        public decimal TaxPercentage { get; set; }

        public string Description { get; set; }
    }
}
