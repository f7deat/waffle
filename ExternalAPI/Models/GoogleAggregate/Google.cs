using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.GoogleAggregate
{
    public class Google
    {
        [JsonPropertyName("bloggerApiKey")]
        public string BloggerApiKey { get; set; } = string.Empty;
    }
}
