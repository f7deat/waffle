using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Services.Tags.Filters;
using Waffle.Entities.Tags;
using Waffle.Models;
using Waffle.Models.Components.Common;

namespace Waffle.Core.IRepositories;

public interface ITagRepository : IAsyncRepository<Tag>
{
    Task<ListResult> GetArticlesByTagAsync(TagArticleFilterOptions filterOptions);
    Task<ListResult> GetPlacesByTagAsync(TagPlaceFilterOptions filterOptions);
    Task<IEnumerable<Option>> GetTagOptionsAsync(SelectOptions selectOptions);
    Task<bool> IsExistsAsync(string name);
    Task<ListResult> ListAsync(TagFilterOptions filterOptions);
}
