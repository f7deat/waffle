using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels;

namespace Waffle.Models.Components.Pickers;

[Display(Name = "Article Picker", Prompt = "article-picker")]
public class ArticlePicker : AbstractComponent
{
    [JsonPropertyName("tagId")]
    public Guid TagId { get; set; }
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonIgnore]
    public List<CatalogListItem> Articles { get; set; } = [];
}
