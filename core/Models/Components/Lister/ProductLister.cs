using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Models.Components;

public class ProductLister : AbstractComponent
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    [JsonPropertyName("itemPerRow")]
    public string ItemPerRow { get; set; } = "col-6";
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;

    [JsonIgnore]
    public ListResult<ProductListItem>? Products { get; set; }
}
