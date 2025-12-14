using Waffle.Models;

namespace Waffle.Core.Services.Locations.Filters;

public class PlaceFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public int? StreetId { get; set; }
}
