using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Tags.Args;
using Waffle.Core.Services.Tags.Filters;
using Waffle.Models;

namespace Waffle.Core.IServices;

public interface ITagService
{
    Task<TResult> CreateAsync(TagCreateArgs args);
    Task<TResult> DeleteAsync(Guid id);
    Task<TResult> GetAsync(Guid id);
    Task<TResult> GetRandomsAsync();
    Task<ListResult> ListAsync(TagFilterOptions filterOptions);
    Task<TResult> UpdateAsync(TagUpdateArgs args);
}
