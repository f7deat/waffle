using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services.Catalogs
{
    public interface ICatalogService
    {
        Task<Catalog> EnsureDataAsync(string name);
        Task<PageVewModel> GetPageDataAsync(Catalog catalog);
    }
}
