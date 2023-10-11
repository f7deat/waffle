using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductRepository : IAsyncRepository<Product>
{
    Task<Product?> FindByCatalogAsync(Guid catalogId);
    Task<List<ProductListItem>> ListAsync(IFilterOptions filterOptions);
}
