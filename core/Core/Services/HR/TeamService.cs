using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.HR;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Entities.Users;
using Waffle.Models;

namespace Waffle.Core.Services.HR;

public class TeamService(ITeamRepository _teamRepository, IDepartmentRepository _departmentRepository, UserManager<ApplicationUser> _userManager) : ITeamService
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

    public async Task<TResult> AddMemberAsync(int teamId, Guid userId)
    {
        if (await _teamRepository.FindAsync(teamId) is null) return TResult.Failed("Team not found!");

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null) return TResult.Failed("User not found!");

        user.TeamId = teamId;
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded ? TResult.Success : TResult.Failed("Unable to add team member.");
    }

    public async Task<TResult> RemoveMemberAsync(int teamId, Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.TeamId != teamId) return TResult.Failed("Team member not found!");

        user.TeamId = null;
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded ? TResult.Success : TResult.Failed("Unable to remove team member.");
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

    public async Task<ListResult> GetMembersAsync(int teamId, FilterOptions filterOptions)
    {
        var query = _userManager.Users
            .Where(x => x.TeamId == teamId)
            .OrderBy(x => x.UserName)
            .Select(x => new
            {
                x.Id,
                x.UserName,
                x.Name,
                x.Email,
                x.PhoneNumber,
                x.Avatar,
                x.CreatedAt
            });
        return await ListResult.Success(query, filterOptions);
    }

    public Task<object> GetOptionsAsync(TeamSelectOptions selecOptions) => _teamRepository.GetOptionsAsync(selecOptions);
}
