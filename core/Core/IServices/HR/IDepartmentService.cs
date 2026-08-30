using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.IServices.HR;

public interface IDepartmentService
{
    Task<TResult> CreateAsync(Department args);
    Task<TResult> UpdateAsync(Department args);
    Task<TResult> DeleteAsync(int id);
    Task<TResult> GetByIdAsync(int id);
    Task<ListResult> GetListAsync(DepartmentFilterOptions filterOptions);
    Task<object> GetOptionsAsync(DepartmentSelectOptions selecOptions);
}
