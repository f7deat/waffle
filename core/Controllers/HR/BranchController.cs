using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.HR;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;

namespace Waffle.Controllers.HR;

public class BranchController(IBranchService _branchService) : BaseController
{
    [HttpGet("options")]
    public async Task<IActionResult> GetOptionsAsync([FromQuery] BranchSelectOptions selecOptions) => Ok(await _branchService.GetOptionsAsync(selecOptions));

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Branch args) => Ok(await _branchService.CreateAsync(args));

    [HttpPut("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] Branch args) => Ok(await _branchService.UpdateAsync(args));

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteAsync(int id) => Ok(await _branchService.DeleteAsync(id));

    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] BranchFilterOptions filterOptions) => Ok(await _branchService.GetListAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id) => Ok(await _branchService.GetByIdAsync(id));
}
