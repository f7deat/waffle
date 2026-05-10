using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Controllers;

[AllowAnonymous]
[Route("s")]
public class ShortUrlController(IShortLinkService shortLinkService) : Controller
{
    private readonly IShortLinkService _shortLinkService = shortLinkService;

    [HttpGet("{code}")]
    public async Task<IActionResult> GoAsync([FromRoute] string code)
    {
        var shortLink = await _shortLinkService.GetByCodeAsync(code);
        if (shortLink is null)
        {
            return NotFound();
        }

        await _shortLinkService.TrackAccessAsync(shortLink.Id);
        return Redirect(shortLink.OriginalUrl);
    }
}
