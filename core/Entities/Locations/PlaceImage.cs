using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Locations;

public class PlaceImage : BaseEntity
{
    [ForeignKey(nameof(Place))]
    public Guid PlaceId { get; set; }
    [StringLength(2048)]
    public string Url { get; set; } = default!;
    public DateTime UploadedAt { get; set; }

    public virtual Place? Place { get; set; }
}
