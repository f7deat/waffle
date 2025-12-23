using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Tags;

public class Tag : BaseEntity
{
    [StringLength(256)]
    public string Name { get; set; } = default!;
    [StringLength(256)]
    public string NormalizedName { get; set; } = default!;
}
