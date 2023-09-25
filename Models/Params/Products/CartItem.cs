using Waffle.Entities;

namespace Waffle.Models.Params.Products;

public class CartItem
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public Catalog? Product { get; set; }
}
