using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductRepository : IAsyncRepository<Product>
{
    Task<Product?> FindByCatalogAsync(Guid catalogId);
    Task<List<ProductListItem>> ListAsync(IFilterOptions filterOptions);
    Task<IdentityResult> SaveBrandAsync(SaveBrandModel args);
}
