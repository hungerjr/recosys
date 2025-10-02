using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Recosys.Backend.Application.Common.Converters
{
    public class NumberToStringConverter : JsonConverter<string>
    {
        public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.TokenType switch
            {
                JsonTokenType.String => reader.GetString(),
                JsonTokenType.Number => reader.GetInt64().ToString(),
                _ => null
            };
        }

        public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
        {
            if (long.TryParse(value, out var number))
                writer.WriteNumberValue(number);
            else
                writer.WriteStringValue(value);
        }
    }

}
