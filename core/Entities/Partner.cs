using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Entities;

public class Partner : BaseEntity
{
    [Required, StringLength(200)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [Required, StringLength(1000)]
    [JsonPropertyName("logo")]
    public string Logo { get; set; } = string.Empty;

    [Required, StringLength(2000)]
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
}