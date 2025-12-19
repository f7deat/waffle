using Waffle.Models;

namespace Waffle.Core.Services.Locations.Filters;

public class StreetSelectOptions : SelectOptions
{
    public int? DistrictId { get; set; }
}
