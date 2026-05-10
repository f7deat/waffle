using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities;

public class ShortLink : BaseEntity
{
    [StringLength(16)]
    public string Code { get; set; } = default!;

    [StringLength(2048)]
    public string OriginalUrl { get; set; } = default!;

    public int ClickCount { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? LastAccessedDate { get; set; }
}
