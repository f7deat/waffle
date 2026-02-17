using Waffle.Models;

namespace Waffle.Core.Services.Tags.Filters;

public class TagPlaceFilterOptions : FilterOptions
{
    public string NormalizedName { get; set; } = default!;
}
