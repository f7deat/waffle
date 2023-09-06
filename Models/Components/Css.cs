using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "CSS", ShortName = nameof(Css))]
public class Css : AbstractComponent
{
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    [JsonPropertyName("value")]
    public string? Value { get; set; }
    [JsonPropertyName("type")]
    public CssType Type { get; set; }
}

public enum CssType
{
    Critical,
    Cdn,
    SelfUrl
}
