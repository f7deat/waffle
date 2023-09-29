using Waffle.Entities.Ecommerces;

namespace Waffle.Models.Params.Products;

public class AddOrderRequest : Order
{
    public List<OrderDetail> OrderDetails { get; set; } = new();
}
