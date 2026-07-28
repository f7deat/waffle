using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Ecommerces;

public class ProductImage : BaseEntity
{
    [ForeignKey(nameof(Product))]
    public Guid ProductId { get; set; }
    [StringLength(2048)]
    public string Url { get; set; } = default!;
    public int SortOrder { get; set; }

    public Product? Product { get; set; }
}