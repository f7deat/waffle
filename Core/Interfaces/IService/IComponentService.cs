using Waffle.Entities;

namespace Waffle.Core.Interfaces.IService
{
    public interface IComponentService
    {
        Task<Component> EnsureComponentAsync(string normalizedName);
        Task<Component?> GetByNameAsync(string name);
        Task<Component?> FindAsync(Guid id);
    }
}
