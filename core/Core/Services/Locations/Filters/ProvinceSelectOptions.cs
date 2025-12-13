using Waffle.Models;

namespace Waffle.Core.Services.Locations.Filters;

public class ProvinceSelectOptions : SelectOptions
{
    public int? CountryId { get; set; }
}
