using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IBranchRepository : IAsyncRepository<Branch>
{
    Task<ListResult> GetListAsync(BranchFilterOptions filterOptions);
    Task<object> GetOptionsAsync(BranchSelectOptions selecOptions);
}
