using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Controllers;

public class ApplicationController(IWikiService _wikiService) : BaseController
{
    [HttpGet("wiki/{id}"), AllowAnonymous]
    public async Task<IActionResult> IndexAsync([FromRoute] string id, [FromQuery] string locale) => Ok(await _wikiService.ParseDynamicAsync(id, locale));
}
