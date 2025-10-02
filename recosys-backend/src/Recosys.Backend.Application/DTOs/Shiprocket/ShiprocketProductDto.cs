using Recosys.Backend.Application.Common.Converters;
using System.Text.Json.Serialization;

namespace Recosys.Backend.Application.DTOs.Shiprocket
{
    public class ShiprocketProductDto
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("channel_order_product_id")]
        public string ChannelOrderProductId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("channel_sku")]
        public string ChannelSku { get; set; }

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("product_id")]
        public long ProductId { get; set; }

        [JsonPropertyName("available")]
        public int Available { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("price")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal Price { get; set; }

        [JsonPropertyName("product_cost")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal ProductCost { get; set; }

        [JsonPropertyName("status_code")]
        public int StatusCode { get; set; }

        [JsonPropertyName("hsn")]
        public string Hsn { get; set; }

        [JsonPropertyName("discount")]
        public decimal Discount { get; set; }

        [JsonPropertyName("discount_including_tax")]
        public decimal DiscountIncludingTax { get; set; }

        [JsonPropertyName("selling_price")]
        public decimal SellingPrice { get; set; }

        [JsonPropertyName("mrp")]
        public decimal Mrp { get; set; }

        [JsonPropertyName("tax_percentage")]
        public decimal TaxPercentage { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }
    }
}
