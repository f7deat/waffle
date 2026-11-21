using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Categories.Filters;
using Waffle.Core.Services.Categories.Results;
using Waffle.Entities.Commons;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface ICategoryRepository : IAsyncRepository<Category>
{
    Task<ListResult> GetListAsync(CategoryFilterOptions filterOptions);
    Task<IReadOnlyList<CategoryTreeItem>> GetTreeAsync(CategoryTreeFilterOptions filterOptions);
    Task<IEnumerable<object>> GetOptionsAsync(CategoryOptionFilterOptions filterOptions);
    Task<TResult> GetRandomsAsync(string locale);
    Task<bool> IsExistsAsync(string normalizedName, int id);
}
