using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities;

namespace Waffle.Models.Components;

[Display(Name = "Card", ShortName = "CARD", GroupName = "")]
public class Card : AbstractComponent
{
    public Card()
    {
        Title = string.Empty;
        Text = string.Empty;
    }
    [JsonPropertyName("title")]
    public string Title { get; set; }
    [JsonPropertyName("text")]
    public string Text { get; set; }
    [JsonPropertyName("image")]
    public FileContent? Image { get; set; }
}
