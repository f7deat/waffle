using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities;

namespace Waffle.Models.Components;

[Display(Name = "Article lister", Prompt = "article-lister")]
public class ArticleLister : AbstractComponent
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonIgnore]
    public ListResult<Catalog>? Articles { get; set; }
}
