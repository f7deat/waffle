using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = nameof(Link), ShortName = nameof(Link))]
public class Link : AbstractComponent
{
    [JsonPropertyName("href")]
    public string Href { get; set; } = "#";
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("target")]
    public string? Target { get; set; }
}
