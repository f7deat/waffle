namespace Waffle.Core.Services.Catalogs.Results;

public class PlaceListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public int ViewCount { get; set; }
    public string NormalizedName { get; set; } = default!;
    public DateTime? ModifiedDate { get; set; }
    public string? DistrictName { get; set; }
    public int? DistrictId { get; set; }
    public string? ProvinceName { get; set; }
    public int? ProvinceId { get; set; }
    public string? Thumbnail { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? OpeningHours { get; set; }
    public decimal? PriceFrom { get; set; }
    public decimal? PriceTo { get; set; }
    public string? Amenities { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? InfluencerName { get; set; }
    public string? InfluencerUserName { get; set; }
    public string? InfluencerAvatar { get; set; }
}
