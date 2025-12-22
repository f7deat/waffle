using Waffle.Models;

namespace Waffle.Core.Services.Locations.Filters;

public class DistrictSelectOptions : SelectOptions
{
    public int? ProvinceId { get; set; }
}
