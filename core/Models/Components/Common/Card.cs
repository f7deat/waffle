using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities.Files;

namespace Waffle.Models.Components;

[Display(Name = "Card", Prompt = "card")]
public class Card : AbstractComponent
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("text")]
    public string? Text { get; set; }
    [JsonPropertyName("image")]
    public FileContent? Image { get; set; }
}
