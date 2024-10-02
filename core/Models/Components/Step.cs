using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = nameof(Step), Prompt = nameof(Step))]
public class Step : AbstractComponent
{
    [JsonPropertyName("subTitle")]
    public string? SubTitle { get; set; }
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("items")]
    public List<StepItem> Items { get; set; } = default!;
}

public class StepItem
{
    [JsonPropertyName("icon")]
    public string? Icon { get; set; }
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("description")]
    public string? Description { get; set; }
}