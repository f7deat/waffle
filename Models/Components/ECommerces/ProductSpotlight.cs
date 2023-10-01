using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities;

namespace Waffle.Models.Components;

[Display(Name = "Product spotlight")]
public class ProductSpotlight : AbstractComponent
{
    [JsonIgnore]
    public IEnumerable<Catalog> Products { get; set; } = new List<Catalog>();
}
