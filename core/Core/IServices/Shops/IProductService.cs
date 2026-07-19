using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.IServices.Shops;

public interface IProductService
{
    Task<TResult> SaveAsync(Product args);
    Task<int> CountAsync();
    Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions);
    Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions catalogFilterOptions);
    Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData);
    Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale);
    Task<TResult> AddLinkAsync(ProductLink args);
    Task<TResult> DeleteLinkAsync(Guid id);
    Task<IEnumerable<ProductLink>> GetLinksAsync(Guid productId);
    Task<TResult> GoToProductLinkAsync(Guid id);
    Task<object> OptionsAsync(SelectOptions selectOptions);
    Task<ListResult<object>> NewArrivalsAsync(ProductFilterOptions filterOptions);
    Task<TResult> CreateAsync(Product args);
    Task<TResult> DeleteAsync(Guid id);
    Task<TResult> DetailAsync(Guid id);
    Task<TResult> GetByNameAsync(string normalizedName);
}
