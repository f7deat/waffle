using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Locations;

public class Place : BaseEntity
{
    public string? Content { get; set; }
    [ForeignKey(nameof(District))]
    public int? DistrictId { get; set; }
    [StringLength(512)]
    public string? Address { get; set; }
    public Guid? InfluencerId { get; set; }
    [StringLength(2048)]
    public string? AffiliateLink { get; set; }
    [Column(TypeName = "decimal(10,7)")]
    public decimal? Latitude { get; set; }
    [Column(TypeName = "decimal(10,7)")]
    public decimal? Longitude { get; set; }

    public virtual District? District { get; set; }
    public virtual ICollection<PlaceImage>? PlaceImages { get; set; }
}
