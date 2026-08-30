using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.HR;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.Services.HR;

public class TeamService(ITeamRepository _teamRepository, IDepartmentRepository _departmentRepository) : ITeamService
{
    public async Task<TResult> CreateAsync(Team args)
    {
        var department = await _departmentRepository.FindAsync(args.DepartmentId);
        if (department is null) return TResult.Failed("Department not found!");

        await _teamRepository.AddAsync(new Team
        {
            Name = args.Name,
            DepartmentId = args.DepartmentId
        });
        return TResult.Success;
    }

    public async Task<TResult> UpdateAsync(Team args)
    {
        var team = await _teamRepository.FindAsync(args.Id);
        if (team is null) return TResult.Failed("Team not found!");

        var department = await _departmentRepository.FindAsync(args.DepartmentId);
        if (department is null) return TResult.Failed("Department not found!");

        team.Name = args.Name;
        team.DepartmentId = args.DepartmentId;
        await _teamRepository.UpdateAsync(team);
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(int id)
    {
        var team = await _teamRepository.FindAsync(id);
        if (team is null) return TResult.Failed("Team not found!");

        await _teamRepository.DeleteAsync(team);
        return TResult.Success;
    }

    public async Task<TResult> GetByIdAsync(int id)
    {
        var team = await _teamRepository.FindAsync(id);
        if (team is null) return TResult.Failed("Team not found!");
        return TResult.Ok(new
        {
            team.Id,
            team.Name,
            team.DepartmentId
        });
    }

    public Task<ListResult> GetListAsync(TeamFilterOptions filterOptions) => _teamRepository.GetListAsync(filterOptions);

    public Task<object> GetOptionsAsync(TeamSelectOptions selecOptions) => _teamRepository.GetOptionsAsync(selecOptions);
}
