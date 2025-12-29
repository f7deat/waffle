using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.Result;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.IServices.Shops;

public interface IProductService
{
    Task<IdentityResult> SaveAsync(Product args);
    Task<int> CountAsync();
    Task<TResult<Product?>> GetByCatalogIdAsync(Guid catalogId);
    Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions);
    Task<IdentityResult> SaveBrandAsync(SaveBrandModel args);
    Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions catalogFilterOptions);
    Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData);
    Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale);
    Task<TResult> AddLinkAsync(ProductLink args);
    Task<TResult> DeleteLinkAsync(Guid id);
    Task<IEnumerable<ProductLink>> GetLinksAsync(Guid productId);
    Task<TResult> GoToProductLinkAsync(Guid id);
    Task<object> OptionsAsync(SelectOptions selectOptions);
    Task<ListResult<object>> NewArrivalsAsync(ProductFilterOptions filterOptions);
    Task<TResult> CreateAsync(Catalog args, string locale);
    Task<TResult> GetByNameAsync(string normalizedName);
}
