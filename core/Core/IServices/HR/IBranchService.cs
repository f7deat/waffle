using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.IServices.HR;

public interface IBranchService
{
    Task<TResult> CreateAsync(Branch args);
    Task<TResult> UpdateAsync(Branch args);
    Task<TResult> DeleteAsync(int id);
    Task<TResult> GetByIdAsync(int id);
    Task<ListResult> GetListAsync(BranchFilterOptions filterOptions);
    Task<object> GetOptionsAsync(BranchSelectOptions selecOptions);
}
