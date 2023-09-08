using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities;

namespace Waffle.Models.Components;

[Display(Name = "Article Spotlight", ShortName = nameof(ArticleSpotlight))]
public class ArticleSpotlight : AbstractComponent
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 5;

    [JsonIgnore]
    public Guid TagId { get; set; }
    [JsonIgnore]
    public List<Catalog> Articles { get; set; } = new();
}
