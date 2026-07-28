using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Waffle.Entities.Files;

public enum VideoSourceType
{
    Upload = 0,
    External = 1
}

public class Video : AuditEntity
{
    [JsonPropertyName("name")]
    [StringLength(260)]
    public string Name { get; set; } = default!;

    [JsonPropertyName("description")]
    [StringLength(1000)]
    public string? Description { get; set; }

    [JsonPropertyName("url")]
    [StringLength(2048)]
    public string Url { get; set; } = default!;

    [JsonPropertyName("thumbnailUrl")]
    [StringLength(2048)]
    public string? ThumbnailUrl { get; set; }

    [JsonPropertyName("sourceType")]
    public VideoSourceType SourceType { get; set; }

    [JsonPropertyName("provider")]
    [StringLength(128)]
    public string? Provider { get; set; }

    [JsonPropertyName("mimeType")]
    [StringLength(256)]
    public string? MimeType { get; set; }

    [JsonPropertyName("size")]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Size { get; set; }

    [JsonPropertyName("durationSeconds")]
    public int? DurationSeconds { get; set; }
}
