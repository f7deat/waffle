using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Locations;

public class City : BaseEntity
{
    public Guid CatalogId { get; set; }
    [StringLength(256)]
    public string Name { get; set; } = default!;

    public ICollection<Room>? Rooms { get; set; }
}
