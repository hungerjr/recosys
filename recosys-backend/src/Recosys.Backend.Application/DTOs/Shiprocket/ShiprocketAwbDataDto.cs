using Recosys.Backend.Application.Common.Converters;
using System.Text.Json.Serialization;

namespace Recosys.Backend.Application.DTOs.Shiprocket
{
    public class ShiprocketAwbDataDto
    {
        [JsonPropertyName("charges")]
        public ShiprocketAwbChargesDto Charges { get; set; }
    }

    public class ShiprocketAwbChargesDto
    {
        [JsonPropertyName("zone")]
        public string Zone { get; set; }

        [JsonPropertyName("cod_charges")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal? CODCharges { get; set; }

        [JsonPropertyName("applied_weight_amount")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal AppliedWeightAmount { get; set; }

        [JsonPropertyName("freight_charges")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal FreightCharges { get; set; }

        [JsonPropertyName("applied_weight")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal AppliedWeight { get; set; }

        [JsonPropertyName("charged_weight")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal ChargedWeight { get; set; }

        [JsonPropertyName("charged_weight_amount")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal ChargedWeightAmount { get; set; }

        [JsonPropertyName("charged_weight_amount_rto")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal ChargedWeightAmountRTO { get; set; }

        [JsonPropertyName("applied_weight_amount_rto")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal AppliedWeightAmountRTO { get; set; }

        [JsonPropertyName("billing_amount")]
        [JsonConverter(typeof(DecimalAsStringConverter))]
        public decimal BillingAmount { get; set; }

        [JsonPropertyName("service_type_id")]
        public string ServiceTypeId { get; set; }
    }

}
