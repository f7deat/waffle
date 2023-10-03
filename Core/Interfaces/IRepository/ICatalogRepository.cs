using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Interfaces.IRepository;

public interface ICatalogRepository : IAsyncRepository<Catalog>
{
    Task<int> CountAsync(CatalogType type);
    Task<Catalog?> FindByNameAsync(string? normalizedName);
    Task<IEnumerable<Option>> GetFormSelectAsync(string keywords);
    Task<ListResult<Catalog>> ListAsync(CatalogFilterOptions filterOptions);
    Task<IEnumerable<Catalog>> ListSpotlightAsync(CatalogType type, int pageSize);
}
