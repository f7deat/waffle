using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components.Landing;

[Display(Name = nameof(AboutUs), Prompt = nameof(AboutUs))]
public class AboutUs : AbstractComponent
{
    [JsonPropertyName("subTitle")]
    public string? SubTitle { get; set; }
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    [JsonPropertyName("videoUrl")]
    public string? VideoUrl { get; set; }
    [JsonPropertyName("featureImage")]
    public string? FeatureImage { get; set; }
}
