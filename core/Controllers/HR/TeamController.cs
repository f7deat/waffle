using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.HR;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;

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

    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] TeamFilterOptions filterOptions) => Ok(await _teamService.GetListAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id) => Ok(await _teamService.GetByIdAsync(id));
}
