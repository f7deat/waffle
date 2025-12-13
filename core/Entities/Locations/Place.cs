using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Locations;

public class Place : BaseEntity
{
    public string? Content { get; set; }
    [ForeignKey(nameof(Street))]
    public int? StreetId { get; set; }
    [StringLength(512)]
    public string? Address { get; set; }

    public virtual Street? Street { get; set; }
    public virtual ICollection<PlaceImage>? PlaceImages { get; set; }
}
