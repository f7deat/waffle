namespace Waffle.Entities.Locations;

public class Country : BaseEntity
{
    public Guid CatalogId { get; set; }
    public string Name { get; set; } = default!;

    public ICollection<Room>? Rooms { get; set; }
}
