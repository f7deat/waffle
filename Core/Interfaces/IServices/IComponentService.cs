using Waffle.Entities;

namespace Waffle.Core.Interfaces.IServices
{
    public interface IComponentService
    {
        Task<Component?> GetByNameAsync(string name);
    }
}
