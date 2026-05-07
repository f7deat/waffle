using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Files;

public class Photo : BaseEntity
{
    [ForeignKey(nameof(Album))]
    public Guid AlbumId { get; set; }
    [StringLength(260)]
    public string Name { get; set; } = default!;
    [StringLength(2048)]
    public string Url { get; set; } = default!;
    [StringLength(256)]
    public string Type { get; set; } = default!;
    public DateTime UploadedAt { get; set; }

    public virtual Album? Album { get; set; }
}