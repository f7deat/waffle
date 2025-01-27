using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Foundations;
using Waffle.Models;

namespace Waffle.Controllers;

public class ComponentController(IComponentService componentService) : BaseController
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await componentService.FindAsync(id));

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] ComponentFilterOptions filterOptions)
    {
        try
        {
            return Ok(await componentService.ListAsync(filterOptions));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpGet("list-work/{id}")]
    public async Task<IActionResult> ListWorkAsync([FromRoute] Guid id, [FromQuery] WorkFilterOptions filterOptions) => Ok(await componentService.ListWorkAsync(id, filterOptions));

    [HttpPost("delete/{id}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await componentService.DeleteAsync(id));

    [HttpPost("active/{id}")]
    public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await componentService.ActiveAsync(id));

    [HttpPost("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] Component args) => Ok(await componentService.UpdateAsync(args));

    [HttpGet("form-select")]
    public async Task<IActionResult> FormSelectAsync([FromQuery] SearchFilterOptions filterOptions) => Ok(await componentService.FormSelectAsync(filterOptions));

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] Component args) => Ok(await componentService.AddAsync(args));
}
