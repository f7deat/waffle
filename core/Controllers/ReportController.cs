using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Foundations;

namespace Waffle.Controllers;

public class ReportController : BaseController
{
    private readonly ICatalogService _catalogService;
    public ReportController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    [HttpGet("activity")]
    public async Task<IActionResult> GetActivityAsync() => Ok(await _catalogService.GetActivityAsync());
}
