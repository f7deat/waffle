using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Files;

public class ImageAlbum : BaseEntity
{
    [StringLength(200)]
    public string Name { get; set; } = default!;
    [StringLength(1000)]
    public string? Description { get; set; }
    [StringLength(200)]
    public string NormalizedName { get; set; } = default!;

    public virtual ICollection<ImageLibraryItem>? Images { get; set; }
}