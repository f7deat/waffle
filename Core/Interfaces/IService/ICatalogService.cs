using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Catalogs;

namespace Waffle.Core.Interfaces.IService
{
    public interface ICatalogService
    {
        Task<IdentityResult> ActiveAsync(Guid id);
        Task<PayloadResult<Catalog>> AddAsync(Catalog catalog);
        Task<Catalog> EnsureDataAsync(string name);
        Task<Catalog?> GetByNameAsync(string normalizedName);
        Task<IEnumerable<ComponentListItem>> ListComponentAsync(Guid catalogId);
        Task<IdentityResult> ArticleSaveAsync(Catalog args);
        Task<IdentityResult> UpdateThumbnailAsync(Catalog args);
        Task<ListResult<ArticleListItem>> ArticleListAsync(ArticleFilterOptions filterOptions);
        Task<ListResult<ArticleListItem>> ArticleRelatedListAsync(ArticleRelatedFilterOption filterOptions);
        Task<Catalog?> FindAsync(Guid id);
    }
}
