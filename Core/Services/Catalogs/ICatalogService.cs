using Waffle.Entities;

namespace Waffle.Core.Services.Catalogs
{
    public interface ICatalogService
    {
        Task<Catalog> EnsureDataAsync(string name);
    }
}
