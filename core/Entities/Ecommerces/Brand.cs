using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Ecommerces;

public class Brand : AuditEntity<int>, ISoftDelete
{
    [StringLength(256)]
    public string Name { get; set; } = default!;
    [StringLength(256)]
    public string NormalizedName { get; set; } = default!;
    [StringLength(512)]
    public string? Description { get; set; }
    [StringLength(2048)]
    public string? Logo { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; }
    public int ViewCount { get; set; }

    public ICollection<Product>? Products { get; set; }
}
