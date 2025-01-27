using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Args.Catalogs;
using Waffle.Models.Components;
using Waffle.Models.Result;
using Waffle.Models.ViewModels;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Interfaces.IService;

public interface ICatalogService
{
    Task<IdentityResult> ActiveAsync(Guid id);
    Task<IdentityResult> AddAsync(Catalog catalog);
    Task<Catalog> EnsureDataAsync(string name, string locale, CatalogType type = CatalogType.Leaf);
    Task<Catalog?> GetByNameAsync(string? normalizedName);
    Task<List<ComponentListItem>> ListComponentAsync(Guid catalogId);
    Task<IdentityResult> UpdateThumbnailAsync(Catalog args);
    Task<ListResult<CatalogListItem>?> ArticleRelatedListAsync(ArticleRelatedFilterOption filterOptions);
    Task<Catalog?> FindAsync(Guid id);
    Task<bool> HasChildAsync(Guid parentId);
    Task<IdentityResult> SaveAsync(Catalog args);
    IAsyncEnumerable<Option> GetTypesAsync();
    Task<ListResult<CatalogListItem>> ListAsync(CatalogFilterOptions filterOptions);
    Task<List<Catalog>> ListTagByIdAsync(Guid id);
    Task<IEnumerable<Option>> ListTagSelectAsync(TagFilterOptions filterOptions);
    Task<IdentityResult> TagAddToCatalogAsync(WorkItem args);
    Task<ListResult<Catalog>> ListByTagsAsync(IEnumerable<Guid> tagIds, CatalogFilterOptions filterOptions);
    Task<ListResult<CatalogListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions);
    Task<IEnumerable<Catalog>> ListRandomTagAsync(string locale);
    Task<ListResult<TagListItem>> ListTagAsync(TagFilterOptions filterOptions);
    Task<object?> PieChartAsync();
    Task<ProductImage?> GetProductImageAsync(Guid catalogId);
    Task<IEnumerable<Option>> GetFormSelectAsync(SelectFilterOptions filterOptions);
    Task<IEnumerable<CatalogListItem>> ListSpotlightAsync(PageData pageData, int pageSize);
    Task<DefResult> DeleteAsync(Catalog catalog);
    Task<Catalog?> FindAsync(Guid brandId, CatalogType brand);
    Task<IEnumerable<Catalog>> GetTopViewAsync(CatalogType type);
    Task<IEnumerable<Guid>> ListTagIdsAsync(Guid id);
    Task<object?> GetStructureByIdAsync(Guid id);
    Task<int> GetViewCountAsync();
    Task<object?> GetComponentsAsync(GetComponentsArgs args);
    Task<object?> GetStructureAsync(string normalizedName);
    Task<IdentityResult> DeleteRangeAsync(List<Guid> ids);
    Task<object?> GetActivityAsync();
    Task<PageData> GetEntryPageDataAsync(string normalizedName);
    Task<IdentityResult> SaveSettingAsync(Catalog catalog);
    Task<PageData?> GetPageDataAsync(string? normalizedName);
    Task<object?> GetUrlOptionsAsync(OptionFilterOptions filterOptions);
    Task<DefResult> CreateTagAsync(CreateTagArgs args, string locale);
    Task<object> GetTypeAsync(CatalogType type);
    Task<object?> GetOptionsAsync(CatalogSelectOptions filterOptions);
}
