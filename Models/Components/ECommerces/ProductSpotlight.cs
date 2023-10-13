using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Models.Components;

[Display(Name = "Product spotlight", Prompt = "product-spotlight", AutoGenerateField = true)]
public class ProductSpotlight : AbstractComponent
{
    [JsonPropertyName("itemPerRow")]
    public string ItemPerRow { get; set; } = "col-6";
    [JsonIgnore]
    public IEnumerable<ProductListItem> Products { get; set; } = new List<ProductListItem>();
}
