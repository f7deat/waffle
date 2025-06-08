using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.Result;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductRepository : IAsyncRepository<Product>
{
    Task<Product?> FindByCatalogAsync(Guid catalogId);
    Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions);
    Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions);
    Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData);
    Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale);
    Task<IdentityResult> SaveBrandAsync(SaveBrandModel args);
    Task<bool> AnyAsync(Guid productId);
    Task<object> OptionsAsync();
    Task<ListResult<object>> NewArrivalsAsync(ProductFilterOptions filterOptions);
    Task<DefResult> CreateAsync(Catalog args, string locale);
}
