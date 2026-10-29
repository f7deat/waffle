using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Ecommerces;

public class OrderDetail : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    [Column(TypeName = "money")]
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}
