using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Categories.Filters;
using Waffle.Entities.Settings;
using Waffle.Models;

namespace Waffle.Core.IServices;

public interface ICategoryService
{
    Task<TResult> CreateAsync(Category args, string locale);
    Task<TResult> UpdateAsync(Category args);
    Task<TResult> DeleteAsync(int id);
    Task<TResult> GetByIdAsync(int id);
    Task<ListResult> GetListAsync(CategoryFilterOptions filterOptions);
    Task<IEnumerable<object>> GetOptionsAsync(CategoryOptionFilterOptions filterOptions);
}
