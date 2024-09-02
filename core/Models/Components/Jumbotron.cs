using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "Jumbotron", Prompt = "jumbotron")]
public class Jumbotron : AbstractComponent
{
    [JsonPropertyName("backgroundImage")]
    public string? BackgroundImage { get; set; }
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("links")]
    public List<Link> Links { get; set; } = new();

    [JsonIgnore]
    public bool HasBackgroundImage => !string.IsNullOrEmpty(BackgroundImage);
}
