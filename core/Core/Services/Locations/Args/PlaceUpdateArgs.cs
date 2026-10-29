using Waffle.Entities;

namespace Waffle.Core.Services.Locations.Args;

public class PlaceUpdateArgs : BaseEntity
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool? Active { get; set; }
    public int? DistrictId { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OpeningHours { get; set; }
    public decimal? PriceFrom { get; set; }
    public decimal? PriceTo { get; set; }
    public string? Amenities { get; set; }
    public string? Content { get; set; }
    public Guid? InfluencerId { get; set; }
    public string? AffiliateLink { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}
