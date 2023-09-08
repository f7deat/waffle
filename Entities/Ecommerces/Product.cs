namespace Waffle.Entities.Ecommerces
{
    public class Product : BaseEntity
    {
        public Guid CatalogId { get; set; }
        public decimal? Price { get; set; }
        public string? SKU { get; set; }
    }
}
