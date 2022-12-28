using Waffle.Entities;

namespace Waffle.Core.Interfaces.IService
{
    public interface IComponentService
    {
        Task<Component?> GetByNameAsync(string name);
    }
}
