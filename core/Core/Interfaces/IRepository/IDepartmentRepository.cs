using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IDepartmentRepository : IAsyncRepository<Department>
{
    Task<ListResult> GetListAsync(DepartmentFilterOptions filterOptions);
    Task<object> GetOptionsAsync(DepartmentSelectOptions selecOptions);
}
