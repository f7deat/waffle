using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface ICatalogRepository : IAsyncRepository<Catalog>
{
    Task<Catalog?> FindByNameAsync(string? normalizedName);
    Task<ListResult<Catalog>> ListAsync(CatalogFilterOptions filterOptions);
}
