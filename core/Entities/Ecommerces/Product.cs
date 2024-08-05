using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Ecommerces;

public class Product : BaseEntity
{
    public Guid CatalogId { get; set; }
    [Column(TypeName = "money")]
    public decimal? Price { get; set; }
    [StringLength(50)]
    public string? SKU { get; set; }
    public int? UnitInStock { get; set; }
    [Column(TypeName = "money")]
    public decimal? SalePrice { get; set; }
}
