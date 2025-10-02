using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Recosys.Backend.Application.Common.Converters
{
    public class DecimalAsStringConverter : JsonConverter<decimal>
    {
        public override decimal Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String &&
                decimal.TryParse(reader.GetString(), out var value))
            {
                return value;
            }

            if (reader.TokenType == JsonTokenType.Number)
            {
                return reader.GetDecimal();
            }

            return 0; // default if parsing fails
        }

        public override void Write(Utf8JsonWriter writer, decimal value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("0.##")); // keep consistent formatting
        }
    }
}
