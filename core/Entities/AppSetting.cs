using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations.Interfaces;

namespace Waffle.Entities;

public class AppSetting : BaseEntity, ILocale
{
    [StringLength(100), Required]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    [StringLength(100), Required]
    [JsonPropertyName("normalizedName")]
    public string NormalizedName { get; set; } = string.Empty;
    [StringLength(500)]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    [JsonPropertyName("value")]
    public string? Value { get; set; }
    [StringLength(10)]
    public string Locale { get; set; } = "vi-VN";
}
