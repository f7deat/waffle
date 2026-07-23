using System.ComponentModel.DataAnnotations.Schema;
using Waffle.Entities.Tags;

namespace Waffle.Entities.Ecommerces;

public class ProductTag
{
    [ForeignKey(nameof(Product))]
    public Guid ProductId { get; set; }
    [ForeignKey(nameof(Tag))]
    public Guid TagId { get; set; }

    public Product? Product { get; set; }
    public Tag? Tag { get; set; }
}