﻿using Microsoft.AspNetCore.Identity;
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
    Task<List<ProductListItem>> ListAsync(IFilterOptions filterOptions);
    Task<IdentityResult> SaveBrandAsync(SaveBrandModel args);
}
