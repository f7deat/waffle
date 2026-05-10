using Waffle.Entities.Settings;
using Waffle.Models;

namespace Waffle.Core.Services.Categories.Filters;

public class CategoryFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public CategoryType? Type { get; set; }
    public int? ParentId { get; set; }
}

public class CategoryOptionFilterOptions
{
    public string? Locale { get; set; }
    public string? KeyWords { get; set; }
    public CategoryType? Type { get; set; }
    public int? ExcludeId { get; set; }
}
