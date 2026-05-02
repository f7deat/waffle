using System.ComponentModel.DataAnnotations;

namespace Waffle.Core.Services.Files.Args;

public class UpsertImageAlbumArgs
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = default!;
    [StringLength(1000)]
    public string? Description { get; set; }
}