using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Interfaces.IService
{
    public interface ICatalogService
    {
        Task<IdentityResult> ActiveAsync(Guid id);
        Task<IdentityResult> AddAsync(Catalog catalog);
        Task<Catalog> EnsureDataAsync(string name, CatalogType type = CatalogType.Default);
        Task<Catalog?> GetByNameAsync(string? normalizedName);
        Task<List<ComponentListItem>> ListComponentAsync(Guid catalogId);
        Task<IdentityResult> ArticleSaveAsync(Catalog args);
        Task<IdentityResult> UpdateThumbnailAsync(Catalog args);
        Task<ListResult<Catalog>> ArticleListAsync(ArticleFilterOptions filterOptions);
        Task<ListResult<Catalog>> ArticleRelatedListAsync(ArticleRelatedFilterOption filterOptions);
        Task<Catalog?> FindAsync(Guid id);
        Task<IEnumerable<Catalog>> ArticlePickerListAsync();
        Task<IdentityResult> SaveAsync(Catalog args);
        IEnumerable<Option> GetTypes();
        Task<WorkContent?> FirstWorkAsync(Guid id);
        Task<ListResult<Catalog>> ListAsync(CatalogFilterOptions filterOptions);
        Task<List<Catalog>> ListTagByIdAsync(Guid id);
        Task<IEnumerable<Option>> ListTagSelectAsync(TagFilterOptions filterOptions);
        Task<IdentityResult> TagAddToCatalogAsync(WorkItem args);
        Task<ListResult<Catalog>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions);
        Task<IEnumerable<Catalog>> ListRandomTagAsync();
        Task<ListResult<TagListItem>> ListTagAsync(IFilterOptions filterOptions);
        Task<object?> PieChartAsync();
    }
}
