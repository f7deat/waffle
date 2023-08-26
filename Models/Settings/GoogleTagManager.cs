using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Models.Settings;

[Display(Name = "Google Tag Manager", ShortName = "GOOGLE_TAG_MANAGER")]
public class GoogleTagManager
{
    [JsonPropertyName("tagId")]
    public string? TagId { get; set; }
}
