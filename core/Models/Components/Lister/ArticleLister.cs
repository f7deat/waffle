using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities;
using Waffle.Models.ViewModels;

namespace Waffle.Models.Components;

[Display(Name = "Article lister", Prompt = "article-lister")]
public class ArticleLister : AbstractComponent
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;
    [JsonIgnore]
    public ListResult<CatalogListItem>? Articles { get; set; }
}
