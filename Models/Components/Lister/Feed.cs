using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities;

namespace Waffle.Models.Components;

[Display(Name = "Feed", ShortName = "Feed")]
public class Feed : AbstractComponent
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }
    [JsonPropertyName("type")]
    public CatalogType? Type { get; set; }
    [JsonPropertyName("itemPerRow")]
    public string ItemPerRow { get; set; } = "grid-cols-2 md:grid-cols-4";

    [JsonIgnore]
    public List<Catalog> Articles { get; set; } = new();
}
