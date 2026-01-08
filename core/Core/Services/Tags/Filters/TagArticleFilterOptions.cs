using Waffle.Models;

namespace Waffle.Core.Services.Tags.Filters;

public class TagArticleFilterOptions : FilterOptions
{
    public Guid TagId { get; set; }
}
