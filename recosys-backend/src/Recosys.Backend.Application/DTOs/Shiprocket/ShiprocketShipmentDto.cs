using Recosys.Backend.Application.Common.Converters;
using System;
using System.Text.Json.Serialization;

namespace Recosys.Backend.Application.DTOs.Shiprocket
{
    public class ShiprocketShipmentDto
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("isd_code")]
        public string IsdCode { get; set; }

        [JsonPropertyName("courier")]
        public string Courier { get; set; }

        [JsonPropertyName("courier_id")]
        [JsonConverter(typeof(NumberToStringConverter))]
        public string CourierId { get; set; }

        [JsonPropertyName("awb")]
        public string Awb { get; set; }

        [JsonPropertyName("weight")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal Weight { get; set; }

        [JsonPropertyName("dimensions")]
        public string Dimensions { get; set; }

        [JsonPropertyName("delivered_date")]
        [JsonConverter(typeof(DateTimeAsStringConverter))]
        public DateTime? DeliveredDate { get; set; }

        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("total")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal Total { get; set; }

        [JsonPropertyName("cost")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal Cost { get; set; }
    }
}
