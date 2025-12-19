using Waffle.Models;

namespace Waffle.Core.Services.Locations.Filters;

public class StreetFilterOptions : FilterOptions
{
    public int? DistrictId { get; set; }
}
