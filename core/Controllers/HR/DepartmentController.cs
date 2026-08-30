using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.HR;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;

namespace Waffle.Controllers.HR;

public class DepartmentController(IDepartmentService _departmentService) : BaseController
{
    [HttpGet("options")]
    public async Task<IActionResult> GetOptionsAsync([FromQuery] DepartmentSelectOptions selecOptions) => Ok(await _departmentService.GetOptionsAsync(selecOptions));

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Department args) => Ok(await _departmentService.CreateAsync(args));

    [HttpPut("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] Department args) => Ok(await _departmentService.UpdateAsync(args));

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteAsync(int id) => Ok(await _departmentService.DeleteAsync(id));

    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] DepartmentFilterOptions filterOptions) => Ok(await _departmentService.GetListAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id) => Ok(await _departmentService.GetByIdAsync(id));
}
