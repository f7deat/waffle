using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities;

public class Menu : BaseEntity
{
    public string Name { get; set; } = default!;
    public int SortOrder { get; set; }
    public Guid? ParentId { get; set; }
    public string? Url { get; set; }
    [StringLength(10)]
    public string Locale { get; set; } = default!;
    public bool Active { get; set; }
    [StringLength(1024)]
    public string? Icon { get; set; }
}
