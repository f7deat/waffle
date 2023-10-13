﻿using Microsoft.AspNetCore.Identity;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductRepository : IAsyncRepository<Product>
{
    Task<Product?> FindByCatalogAsync(Guid catalogId);
    Task<List<ProductListItem>> ListAsync(IFilterOptions filterOptions);
    Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions);
    Task<IEnumerable<ProductListItem>> ListRelatedAsync(IEnumerable<Guid> tagIds, Guid currentCatalogId);
    Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize);
    Task<IdentityResult> SaveBrandAsync(SaveBrandModel args);
}
