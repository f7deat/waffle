using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductRepository : IAsyncRepository<Product>
{
    Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions);
    Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions);
    Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData);
    Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale);
    Task<bool> AnyAsync(Guid productId);
    Task<object> OptionsAsync(SelectOptions selectOptions);
    Task<ListResult<object>> NewArrivalsAsync(ProductFilterOptions filterOptions);
    Task<TResult> CreateAsync(Product args);
    Task<TResult> DeleteAsync(Guid id);
    Task<Product?> DetailAsync(Guid id);
    Task<TResult> GetByNameAsync(string normalizedName);
}
