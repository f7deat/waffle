using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Models;

public class FileUploadResponse
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = default!;
}
