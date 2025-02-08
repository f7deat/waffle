using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Models;

public class FileUploadResponse
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    [JsonPropertyName("url")]
    public string Url { get; set; } = default!;
}
