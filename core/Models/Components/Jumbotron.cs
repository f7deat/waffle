using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "Jumbotron", Prompt = nameof(Jumbotron))]
public class Jumbotron : AbstractComponent
{
    [JsonPropertyName("backgroundImage")]
    public string? BackgroundImage { get; set; }
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("subTitle")]
    public string? SubTitle { get; set; }
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    [JsonPropertyName("heroImage")]
    public string? HeroImage { get; set; }

    [JsonPropertyName("links")]
    public List<Link> Links { get; set; } = new();

    [JsonIgnore]
    public bool HasBackgroundImage => !string.IsNullOrEmpty(BackgroundImage);
}
