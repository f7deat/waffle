using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Ecommerces;

public class ProductVariant : BaseEntity
{
    [ForeignKey(nameof(Product))]
    public Guid ProductId { get; set; }
    [StringLength(256)]
    public string? Name { get; set; }
    [StringLength(50)]
    public string? SKU { get; set; }
    [Column(TypeName = "money")]
    public decimal? Price { get; set; }
    [Column(TypeName = "money")]
    public decimal? SalePrice { get; set; }
    public int? UnitInStock { get; set; }
    [StringLength(2048)]
    public string? Thumbnail { get; set; }
    public int SortOrder { get; set; }

    public Product? Product { get; set; }
}