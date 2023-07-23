using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Models.Components;

[Display(Name = "Swiper", ShortName = "SWIPER")]
public class Swiper : AbstractComponent
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("mode")]
    public string Mode { get; set; } = "default";

    [JsonIgnore]
    public List<SwiperItem> Items { get; set; } = new();
}

[Display(Name = "Swiper Item")]
public class SwiperItem
{
    public string? Title { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
    public string? Url { get; set; }
}
