using Waffle.Models;

namespace Waffle.Core.Services.Articles.Filters;

public class ArticleFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public int? CategoryId { get; set; }
    /// <summary>latest (default) | most-viewed</summary>
    public string? Sort { get; set; }
}
