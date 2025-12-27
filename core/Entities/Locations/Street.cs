using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Locations;

public class Street : BaseEntity<int>
{
    [StringLength(256)]
    public string Name { get; set; } = default!;
    [ForeignKey(nameof(District))]
    public int DistrictId { get; set; }

    public District? District { get; set; }
}
