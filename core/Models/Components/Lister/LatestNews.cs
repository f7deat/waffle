using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels;

namespace Waffle.Models.Components;

[Display(Name = "Latest News", Prompt = "LatestNews")]
public class LatestNews : AbstractComponent
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("subTitle")]
    public string? SubTitle { get; set; }
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }

    [JsonIgnore]
    public IEnumerable<CatalogListItem> Data { get; set; } = new List<CatalogListItem>();
}
