﻿using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Interfaces.IService;

public interface IProductService
{
    Task<IdentityResult> SaveAsync(Product args);
    Task<int> CountAsync();
    Task<Product?> GetByCatalogIdAsync(Guid catalogId);
    Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions);
    Task<IdentityResult> SaveBrandAsync(SaveBrandModel args);
    Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions catalogFilterOptions);
    Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData);
    Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale);
}
