using Waffle.Core.Interfaces;
using Waffle.Entities.Tags;
using Waffle.Models;
using Waffle.Models.Components.Common;

namespace Waffle.Core.IRepositories;

public interface ITagRepository : IAsyncRepository<Tag>
{
    Task<IEnumerable<Option>> GetTagOptionsAsync(SelectOptions selectOptions);
    Task<bool> IsExistsAsync(string name);
}
