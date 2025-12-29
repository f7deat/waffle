using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Catalogs.Args;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components.Common;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Interfaces.IRepository;

public interface ICatalogRepository : IAsyncRepository<Catalog>
{
    Task<int> CountAsync(CatalogType type);
    Task<Catalog?> FindAsync(Guid catalogId, CatalogType type);
    Task<Catalog?> FindByNameAsync(string? normalizedName);
    Task<Catalog?> GetByNameAsync(string normalizedName);
    Task<dynamic> GetComponentsAsync(Guid id);
    Task<IEnumerable<Option>> GetFormSelectAsync(SelectOptions filterOptions);
    Task<object?> GetStructureAsync(Guid id);
    Task<object?> GetStructureAsync(string normalizedName);
    Task<object> GetTagOptionsAsync(SelectOptions selectOptions);
    Task<IEnumerable<Catalog>> GetTopViewAsync(CatalogType type, string locale);
    Task<int> GetViewCountAsync(string locale);
    Task IncreaseCountAsync(Catalog catalog);
    Task<ListResult<CatalogListItem>> ListAsync(CatalogFilterOptions filterOptions);
    Task<IEnumerable<CatalogListItem>> ListSpotlightAsync(PageData pageData, int pageSize);
    Task<TResult> SaveTagsAsync(SaveCatalogTagsArgs args);
    Task<TResult> TagsAsync(Guid catalogId);
}
