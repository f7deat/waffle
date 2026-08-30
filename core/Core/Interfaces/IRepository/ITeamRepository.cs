using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface ITeamRepository : IAsyncRepository<Team>
{
    Task<ListResult> GetListAsync(TeamFilterOptions filterOptions);
    Task<object> GetOptionsAsync(TeamSelectOptions selecOptions);
}
