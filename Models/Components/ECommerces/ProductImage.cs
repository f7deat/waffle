using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "Product Images", Prompt = "product-images")]
public class ProductImage : AbstractComponent
{
    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();
}
