using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Recosys.Backend.Application.Common.Converters
{
    public class DateTimeAsStringConverter : JsonConverter<DateTime?>
    {
        private readonly string[] formats = new[]
        {
            "dd MMM yyyy, hh:mm tt",   // e.g. "20 Sep 2025, 12:21 PM"
            "dd-MM-yyyy HH:mm:ss",     // e.g. "26-09-2025 17:22:22"
            "yyyy-MM-dd HH:mm:ss",     // e.g. "2025-09-22 09:00:00"
            "yyyy-MM-ddTHH:mm:ss",     // ISO (just in case)
        };

        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                var str = reader.GetString();
                if (string.IsNullOrWhiteSpace(str) || str == "0000-00-00 00:00:00")
                    return null;

                if (DateTime.TryParseExact(str, formats, CultureInfo.InvariantCulture,
                                           DateTimeStyles.None, out var value))
                {
                    return value;
                }

                // fallback to default parser
                if (DateTime.TryParse(str, out var fallback))
                    return fallback;
            }

            return null;
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (value.HasValue)
                writer.WriteStringValue(value.Value.ToString("dd MMM yyyy, hh:mm tt"));
            else
                writer.WriteNullValue();
        }
    }
}
