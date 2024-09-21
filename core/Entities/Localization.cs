using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Entities;

public class Localization : BaseEntity
{
    [Required, StringLength(10)]
    [JsonPropertyName("language")]
    public string Language { get; set; } = default!;
    [Required, StringLength(100)]
    [JsonPropertyName("key")]
    public string Key { get; set; } = default!;
    [JsonPropertyName("value")]
    public string? Value { get; set; }
}
