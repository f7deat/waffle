using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.IServices;
using Waffle.Core.Services.Categories.Filters;
using Waffle.Entities.Settings;

namespace Waffle.Controllers;

public class CategoryController(ICategoryService categoryService) : BaseController
{
    private readonly ICategoryService _categoryService = categoryService;

    [HttpPost, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> CreateAsync([FromBody] Category args, [FromQuery] string locale) => Ok(await _categoryService.CreateAsync(args, locale));

    [HttpPut, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> UpdateAsync([FromBody] Category args) => Ok(await _categoryService.UpdateAsync(args));

    [HttpDelete("{id}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync(int id) => Ok(await _categoryService.DeleteAsync(id));

    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] CategoryFilterOptions filterOptions) => Ok(await _categoryService.GetListAsync(filterOptions));

    [HttpGet("options")]
    public async Task<IActionResult> GetOptionsAsync([FromQuery] CategoryOptionFilterOptions filterOptions) => Ok(await _categoryService.GetOptionsAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id) => Ok(await _categoryService.GetByIdAsync(id));
}
