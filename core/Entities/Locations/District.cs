using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Locations;

public class District : BaseEntity<int>
{
    [StringLength(256)]
    public string Name { get; set; } = default!;
    [ForeignKey(nameof(Province))]
    public int ProvinceId { get; set; }

    public Province? Province { get; set; }
    public ICollection<Street>? Streets { get; set; }
    public ICollection<Place>? Places { get; set; }
}
