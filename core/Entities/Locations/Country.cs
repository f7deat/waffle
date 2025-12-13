namespace Waffle.Entities.Locations;

public class Country : BaseEntity<int>
{
    public string Name { get; set; } = default!;

    public ICollection<Province>? Provinces { get; set; }
}
