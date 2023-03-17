using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Interfaces.IService
{
    public interface ICatalogService
    {
        Task<IdentityResult> ActiveAsync(Guid id);
        Task<PayloadResult<Catalog>> AddAsync(Catalog catalog);
        Task<Catalog> EnsureDataAsync(string name, CatalogType type = CatalogType.Default);
        Task<Catalog?> GetByNameAsync(string normalizedName);
        Task<IEnumerable<ComponentListItem>> ListComponentAsync(Guid catalogId);
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
        Task<IEnumerable<Catalog>> ListTagByIdAsync(Guid id);
        Task<IEnumerable<Option>> ListTagSelectAsync(TagFilterOptions filterOptions);
        Task<IdentityResult> TagAddToCatalogAsync(WorkItem args);
        Task<ListResult<Catalog>> ListByTagAsync(Guid tagId, IFilterOptions filterOptions);
        Task<IEnumerable<Catalog>> ListRandomTagAsync();
    }
}
