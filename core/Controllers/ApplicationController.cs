﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Controllers;

public class ApplicationController(IWikiService _wikiService) : BaseController
{
    [HttpGet("wiki/{}"), AllowAnonymous]
    public async Task<IActionResult> IndexAsync()
    {
        var wiki = await _wikiService.ParseAsync();
        return Ok(wiki);
    }
}
