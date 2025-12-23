using Waffle.Core.Interfaces;
using Waffle.Entities.Tags;

namespace Waffle.Core.IRepositories;

public interface ITagRepository : IAsyncRepository<Tag>
{
    Task<bool> IsExistsAsync(string name);
}
