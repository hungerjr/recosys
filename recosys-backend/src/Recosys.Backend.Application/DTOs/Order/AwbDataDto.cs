namespace Recosys.Backend.Application.DTOs.Order
{
    public class AwbDataDto
    {
        public long AwbDataId { get; set; }

        public string Zone { get; set; }

        public decimal? CODCharges { get; set; }

        public decimal AppliedWeightAmount { get; set; }

        public decimal FreightCharges { get; set; }

        public decimal AppliedWeight { get; set; }

        public decimal ChargedWeight { get; set; }

        public decimal ChargedWeightAmount { get; set; }

        public decimal ChargedWeightAmountRTO { get; set; }

        public decimal AppliedWeightAmountRTO { get; set; }

        public decimal BillingAmount { get; set; }

        public string ServiceTypeId { get; set; }
    }
}
