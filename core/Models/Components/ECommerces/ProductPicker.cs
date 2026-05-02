using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels;

namespace Waffle.Models.Components.ECommerces;

public class ProductPicker : AbstractComponent
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("tagIds")]
    public List<Guid> TagIds { get; set; } = new();

    [JsonIgnore]
    public IEnumerable<CatalogListItem>? Products { get; set; }
}
