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
}
