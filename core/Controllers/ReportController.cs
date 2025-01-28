using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Controllers;

public class ReportController(ICatalogService catalogService) : BaseController
{
    [HttpGet("activity")]
    public async Task<IActionResult> GetActivityAsync() => Ok(await catalogService.GetActivityAsync());
}
