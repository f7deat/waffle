using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IComponentRepository : IAsyncRepository<Component>
{
    Task<List<Component>> ListAsync(SearchFilterOptions filterOptions);
}
