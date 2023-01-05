using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService
{
    public interface ICatalogService
    {
        Task<IdentityResult> ActiveAsync(Guid id);
        Task<PayloadResult<Catalog>> AddAsync(Catalog catalog);
        Task<Catalog> EnsureDataAsync(string name);
        Task<Catalog?> GetByNameAsync(string normalizedName);
        Task<PageVewModel> GetPageDataAsync(Catalog catalog);
        Task<IEnumerable<ComponentListItem>> GetHeaderAsync();
        Task<IEnumerable<ComponentListItem>> GetFooterAsync();
        Task<IEnumerable<ComponentListItem>> ListComponentAsync(Guid catalogId);
        Task<IdentityResult> ArticleSaveAsync(Catalog args);
        Task<IdentityResult> UpdateThumbnailAsync(Catalog args);
    }
}
