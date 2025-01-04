using System.ComponentModel.DataAnnotations.Schema;
using Waffle.Entities.Locations;

namespace Waffle.Entities;

public class Room : BaseEntity
{
    public Guid CatalogId { get; set; }
    public string? AffiliateLink { get; set; }
    public string? Content { get; set; }
    [ForeignKey(nameof(Country))]
    public int? CountryId { get; set; }
    [ForeignKey(nameof(City))]
    public int? CityId { get; set; }

    public City? City { get; set; }
    public Country? Country { get; set; }
}
