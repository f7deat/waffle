using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService
{
    public interface IComponentService
    {
        Task<Component> EnsureComponentAsync(string normalizedName);
        Task<Component?> GetByNameAsync(string name);
        Task<Component?> FindAsync(Guid id);
        Task<ListResult<Component>> ListAsync(IFilterOptions filterOptions);
    }
}
