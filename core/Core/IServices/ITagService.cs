using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Tags.Args;
using Waffle.Core.Services.Tags.Filters;
using Waffle.Models;
using Waffle.Models.Components.Common;

namespace Waffle.Core.IServices;

public interface ITagService
{
    Task<TResult> CreateAsync(TagCreateArgs args);
    Task<TResult> DeleteAsync(Guid id);
    Task<TResult> GetAsync(Guid id);
    Task<TResult> GetRandomsAsync();
    Task<IEnumerable<Option>> GetTagOptionsAsync(SelectOptions selectOptions);
    Task<ListResult> ListAsync(TagFilterOptions filterOptions);
    Task<TResult> UpdateAsync(TagUpdateArgs args);
}
