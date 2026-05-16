using System.Text.Json.Serialization;

namespace Waffle.Core.Services.Settings;

public class SiteSetting
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    [JsonPropertyName("logo")]
    public string Logo { get; set; } = string.Empty;
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("description")]
    public string? Description { get; set; }
}