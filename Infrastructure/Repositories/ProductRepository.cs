using Waffle.Core.Foundations;
using Waffle.Data;
using Waffle.Entities.Ecommerces;

namespace Waffle.Infrastructure.Repositories;

public class ProductRepository : EfRepository<Product>
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }
}
