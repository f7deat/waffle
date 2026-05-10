using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Services.Categories.Filters;
using Waffle.Entities.Settings;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface ICategoryRepository : IAsyncRepository<Category>
{
    Task<ListResult> GetListAsync(CategoryFilterOptions filterOptions);
    Task<IEnumerable<object>> GetOptionsAsync(CategoryOptionFilterOptions filterOptions);
}
