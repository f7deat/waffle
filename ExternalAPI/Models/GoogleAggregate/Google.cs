using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.GoogleAggregate;

public class Google
{
    [JsonPropertyName("bloggerApiKey")]
    public string BloggerApiKey { get; set; } = default!;
    [JsonPropertyName("clientId")]
    public string ClientId { get; set; } = default!;
}
