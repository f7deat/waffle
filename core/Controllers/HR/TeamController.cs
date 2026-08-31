using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.HR;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Controllers.HR;

public class TeamController(ITeamService _teamService) : BaseController
{
    [HttpGet("options")]
    public async Task<IActionResult> GetOptionsAsync([FromQuery] TeamSelectOptions selecOptions) => Ok(await _teamService.GetOptionsAsync(selecOptions));

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Team args) => Ok(await _teamService.CreateAsync(args));

    [HttpPut("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] Team args) => Ok(await _teamService.UpdateAsync(args));

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteAsync(int id) => Ok(await _teamService.DeleteAsync(id));

    [HttpGet("{id}/members")]
    public async Task<IActionResult> GetMembersAsync(int id, [FromQuery] FilterOptions filterOptions) => Ok(await _teamService.GetMembersAsync(id, filterOptions));

    [HttpPost("{id}/members")]
    public async Task<IActionResult> AddMemberAsync(int id, [FromBody] TeamMemberArgs args) => Ok(await _teamService.AddMemberAsync(id, args.UserId));

    [HttpDelete("{id}/members/{userId}")]
    public async Task<IActionResult> RemoveMemberAsync(int id, Guid userId) => Ok(await _teamService.RemoveMemberAsync(id, userId));

    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] TeamFilterOptions filterOptions) => Ok(await _teamService.GetListAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id) => Ok(await _teamService.GetByIdAsync(id));
}

public class TeamMemberArgs
{
    public Guid UserId { get; set; }
}
