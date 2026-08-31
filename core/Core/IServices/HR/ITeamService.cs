using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.IServices.HR;

public interface ITeamService
{
    Task<TResult> CreateAsync(Team args);
    Task<TResult> UpdateAsync(Team args);
    Task<TResult> DeleteAsync(int id);
    Task<TResult> AddMemberAsync(int teamId, Guid userId);
    Task<TResult> RemoveMemberAsync(int teamId, Guid userId);
    Task<TResult> GetByIdAsync(int id);
    Task<ListResult> GetListAsync(TeamFilterOptions filterOptions);
    Task<ListResult> GetMembersAsync(int teamId, FilterOptions filterOptions);
    Task<object> GetOptionsAsync(TeamSelectOptions selecOptions);
}
