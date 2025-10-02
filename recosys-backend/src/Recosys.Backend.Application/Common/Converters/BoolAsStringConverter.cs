using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Recosys.Backend.Application.Common.Converters
{
    public class BoolAsStringConverter : JsonConverter<bool>
    {
        public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            switch (reader.TokenType)
            {
                case JsonTokenType.String:
                    var str = reader.GetString()?.ToLower();
                    if (str == "1" || str == "true" || str == "yes")
                        return true;
                    if (str == "0" || str == "false" || str == "no" || string.IsNullOrWhiteSpace(str))
                        return false;
                    break;

                case JsonTokenType.Number:
                    return reader.GetInt32() != 0;

                case JsonTokenType.True:
                    return true;

                case JsonTokenType.False:
                    return false;
            }

            return false; // default if unrecognized
        }

        public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value ? "1" : "0");
        }
    }
}
