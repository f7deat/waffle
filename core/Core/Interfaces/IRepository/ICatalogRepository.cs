﻿using Waffle.Core.Foundations;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Interfaces.IRepository;

public interface ICatalogRepository : IAsyncRepository<Catalog>
{
    Task<int> CountAsync(CatalogType type);
    Task<Catalog?> FindAsync(Guid catalogId, CatalogType type);
    Task<Catalog?> FindByNameAsync(string? normalizedName);
    Task<Catalog?> GetByNameAsync(string normalizedName);
    Task<dynamic> GetComponentsAsync(Guid id);
    Task<IEnumerable<Option>> GetFormSelectAsync(SelectFilterOptions filterOptions);
    Task<object?> GetStructureAsync(Guid id);
    Task<object?> GetStructureAsync(string normalizedName);
    Task<IEnumerable<Catalog>> GetTopViewAsync(CatalogType type, string locale);
    Task<int> GetViewCountAsync(string locale);
    Task IncreaseCountAsync(Catalog catalog);
    Task<ListResult<CatalogListItem>> ListAsync(CatalogFilterOptions filterOptions);
    Task<IEnumerable<CatalogListItem>> ListSpotlightAsync(PageData pageData, int pageSize);
}
