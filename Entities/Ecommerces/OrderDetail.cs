using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Ecommerces;

public class OrderDetail : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    [Column(TypeName = "money")]
    public decimal Price { get; set; }
    public decimal Quantity { get; set; }
}
