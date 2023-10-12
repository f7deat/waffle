using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels;

namespace Waffle.Models.Components;

[Display(Name = "Product spotlight")]
public class ProductSpotlight : AbstractComponent
{
    [JsonIgnore]
    public IEnumerable<SpotlightListItem> Products { get; set; } = new List<SpotlightListItem>();
}
