using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Locations;

public class Province : BaseEntity<int>
{
    [StringLength(256)]
    public string Name { get; set; } = default!;
    [ForeignKey(nameof(Country))]
    public int CountryId { get; set; }

    public Country? Country { get; set; }
    public ICollection<District>? Districts { get; set; }
}
