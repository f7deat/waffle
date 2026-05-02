using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

public class ProductImage : AbstractComponent
{
    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();
}
