using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Foundations;
using Waffle.Models;

namespace Waffle.Controllers;

public class LogController : BaseController
{
    private readonly IAppLogService _appLogService;
    public LogController(IAppLogService appLogService)
    {
        _appLogService = appLogService;
    }

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] SearchFilterOptions filterOptions) => Ok(await _appLogService.ListAsync(filterOptions));

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _appLogService.DeleteAsync(id));
}
