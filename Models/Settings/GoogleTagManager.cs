using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Models.Settings;

[Display(Name = "Google Tag Manager")]
public class GoogleTagManager
{
    [JsonPropertyName("tagId")]
    public string? TagId { get; set; }
}
