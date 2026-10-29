using Waffle.Models;

namespace Waffle.Core.Services.Locations.Filters;

public class PlaceFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public int? DistrictId { get; set; }
    public int? ProvinceId { get; set; }
    public string? InfluencerUserName { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? HasOpeningHours { get; set; }
    public string? Amenity { get; set; }
    public string? SortBy { get; set; }
}
