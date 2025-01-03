namespace Waffle.Entities;

public class Room : BaseEntity
{
    public Guid CatalogId { get; set; }
    public string? AffiliateLink { get; set; }
    public string? Content { get; set; }
    public int? CountryId { get; set; }
    public int? CityId { get; set; }
}
