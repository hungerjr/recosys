using Recosys.Backend.Application.Common.Converters;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Recosys.Backend.Application.DTOs.Shiprocket
{
    public class ShiprocketOrderDto
    {
        [JsonPropertyName("id")]
        public long ShiprocketId { get; set; }

        [JsonPropertyName("channel_id")]
        public long ChannelId { get; set; }

        [JsonPropertyName("channel_name")]
        public string ChannelName { get; set; }

        [JsonPropertyName("base_channel_code")]
        public string BaseChannelCode { get; set; }

        [JsonPropertyName("channel_order_id")]
        public string ChannelOrderId { get; set; }

        [JsonPropertyName("customer_name")]
        public string CustomerName{ get; set; }

        [JsonPropertyName("customer_email")]
        public string CustomerEmail { get; set; }

        [JsonPropertyName("customer_phone")]
        public string CustomerPhone { get; set; }

        [JsonPropertyName("customer_address")]
        public string CustomerAddress{ get; set; }

        [JsonPropertyName("customer_address_2")]
        public string CustomerAddress2 { get; set; }

        [JsonPropertyName("customer_city")]
        public string CustomerCity{ get; set; }

        [JsonPropertyName("customer_state")]
        public string CustomerState { get; set; }

        [JsonPropertyName("customer_pincode")]
        public string CustomerPincode { get; set; }

        [JsonPropertyName("customer_country")]
        public string CustomerCountry { get; set; }

        [JsonPropertyName("pickup_location")]
        public string PickupLocation { get; set; }

        [JsonPropertyName("total")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal Total { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("status_code")]
        public int StatusCode { get; set; }

        [JsonPropertyName("payment_method")]
        public string PaymentMethod { get; set; }

        [JsonPropertyName("brand_name")]
        public string BrandName { get; set; }

        [JsonPropertyName("marketplace_id")]
        public string MarketplaceId { get; set; }

        [JsonPropertyName("allow_return")]
        [JsonConverter(typeof(BoolAsStringConverter))]
        public bool AllowReturn { get; set; }

        [JsonPropertyName("pickup_exception_reason")]
        public string PickupExceptionReason { get; set; }

        [JsonPropertyName("etd_date")]
        [JsonConverter(typeof(DateTimeAsStringConverter))]
        public DateTime? EtdDate { get; set; }

        [JsonPropertyName("out_for_delivery_date")]
        [JsonConverter(typeof(DateTimeAsStringConverter))]
        public DateTime? OutForDeliveryDate { get; set; }

        [JsonPropertyName("delivered_date")]
        [JsonConverter(typeof(DateTimeAsStringConverter))]
        public DateTime? DeliveredDate { get; set; }

        [JsonPropertyName("invoice_no")]
        public string InvoiceNo { get; set; }

        [JsonPropertyName("channel_created_at")]
        [JsonConverter(typeof(DateTimeAsStringConverter))]
        public DateTime? ChannelCreatedAt { get; set; }

        [JsonPropertyName("created_at")]
        [JsonConverter(typeof(DateTimeAsStringConverter))]
        public DateTime? CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        [JsonConverter(typeof(DateTimeAsStringConverter))]
        public DateTime? UpdatedAt { get; set; }

        [JsonPropertyName("products")]
        public List<ShiprocketProductDto> Products { get; set; }

        [JsonPropertyName("shipments")]
        public List<ShiprocketShipmentDto> Shipments { get; set; }

        [JsonPropertyName("activities")]
        public List<string> Activities { get; set; }

        [JsonPropertyName("awb_data")]
        public ShiprocketAwbDataDto AwbData { get; set; }
    }
}
