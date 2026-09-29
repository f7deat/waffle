using Waffle.Models;

namespace Waffle.Core.Services.Shop.Filters;

public class ProductTagFilterOptions : FilterOptions
{
    public string? TagName { get; set; }
    public string? Name { get; set; }
}
