using Waffle.Models;

namespace Waffle.Core.Services.Tags.Filters;

public class TagPlaceFilterOptions : FilterOptions
{
    public Guid TagId { get; set; }
}
