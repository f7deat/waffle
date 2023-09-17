using Waffle.Entities;

namespace Waffle.Core.Interfaces.IRepository;

public interface ICatalogRepository : IAsyncRepository<Catalog>
{
    Task<Catalog?> FindByNameAsync(string? normalizedName);
}
