using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "WordPress Lister", ShortName = nameof(WordPressLister))]
public class WordPressLister : AbstractComponent
{
    [JsonPropertyName("domain")]
    public string Domain { get; set; } = default!;
    [JsonPropertyName("apiVersion")]
    public int ApiVersion { get; set; }
}
