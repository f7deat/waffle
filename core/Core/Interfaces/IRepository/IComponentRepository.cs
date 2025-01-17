using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Results.Components;

namespace Waffle.Core.Interfaces.IRepository;

public interface IComponentRepository : IAsyncRepository<Component>
{
    Task<Component?> FindByNameAsync(string normalizedName);
    Task<List<Component>> ListAsync(SearchFilterOptions filterOptions);
    Task<ListResult<ComponentListResult>> ListAsync(ComponentFilterOptions filterOptions);
}
