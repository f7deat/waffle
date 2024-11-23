using System.ComponentModel.DataAnnotations;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Models.Components.Pages;

[Display(Name = "Home", Prompt = nameof(Home))]
public class Home : AbstractComponent
{
    public IEnumerable<ProductListItem> Products { get; set; } = new List<ProductListItem>();
}
