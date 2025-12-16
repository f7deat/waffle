using Waffle.Models;

namespace Waffle.Core.Services.Locations.Filters;

public class DistrictFilterOptions : FilterOptions
{
    public int? CountryId { get; set; }
    public int? ProvinceId { get; set; }
}
