using System.Text.Json.Serialization;

namespace Waffle.Models.Components;

public class Social
{
    [JsonPropertyName("facebookUrl")]
    public string? FacebookUrl { get; set; }
    [JsonPropertyName("youtubeUrl")]
    public string? YoutubeUrl { get; set; }
    [JsonPropertyName("xUrl")]
    public string? XUrl { get; set; }
    [JsonPropertyName("instagramUrl")]
    public string? InstagramUrl { get;}
}
