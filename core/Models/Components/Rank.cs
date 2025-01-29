using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "Rank", Prompt = "Rank")]
public class Rank : AbstractComponent
{
    [JsonIgnore]
    public Guid CatalogId { get; set; }
    [JsonPropertyName("items")]
    public List<RankItem>? Items { get; set; }
}

public class RankItem
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("thumbnail")]
    public string? Thumbnail { get; set; }
    [JsonPropertyName("rating")]
    public int Rating { get; set; }
    [JsonPropertyName("description")]
    public string? Description { get; set; }
}
