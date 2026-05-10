using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Waffle.Entities.Settings;

namespace Waffle.Entities.Ecommerces;

public class Product : AuditEntity
{
    [StringLength(256)]
    public string Name { get; set; } = default!;
    [StringLength(512)]
    public string? Description { get; set; }
    [StringLength(256)]
    public string NormalizedName { get; set; } = default!;
    [StringLength(2048)]
    public string? Thumbnail { get; set; }
    public int ViewCount { get; set; }
    [Column(TypeName = "money")]
    public decimal? Price { get; set; }
    [StringLength(50)]
    public string? SKU { get; set; }
    public int? UnitInStock { get; set; }
    [Column(TypeName = "money")]
    public decimal? SalePrice { get; set; }
    [StringLength(2048)]
    public string? AffiliateLink { get; set; }
    public string? Content { get; set; }
    [ForeignKey(nameof(Category))]
    public int? CategoryId { get; set; }
    [StringLength(10)]
    public string Locale { get; set; } = "vi-VN";

    public Category? Category { get; set; }
}
