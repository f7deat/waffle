using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Controllers;

public class ShortLinkController(IShortLinkService shortLinkService) : BaseController
{
    private readonly IShortLinkService _shortLinkService = shortLinkService;

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync()
    {
        var data = await _shortLinkService.ListAsync();
        return Ok(new
        {
            data = data.Select(MapItem),
            total = data.Count,
        });
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateAsync([FromBody] CreateShortLinkArgs args)
    {
        var result = await _shortLinkService.CreateAsync(args.Url);
        if (!result.Succeeded)
        {
            return BadRequest(result.Message);
        }

        var data = result.Data as ShortLink;
        if (data is null)
        {
            return BadRequest("Cannot create short link");
        }

        return Ok(MapItem(data));
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        var result = await _shortLinkService.DeleteAsync(id);
        if (!result.Succeeded)
        {
            return BadRequest(result.Message);
        }

        return Ok(result);
    }

    [HttpPost("clear")]
    public async Task<IActionResult> ClearAsync() => Ok(await _shortLinkService.ClearAsync());

    [HttpGet("go/{code}"), AllowAnonymous]
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

    private object MapItem(ShortLink item)
    {
        return new
        {
            item.Id,
            item.Code,
            item.OriginalUrl,
            item.ClickCount,
            item.CreatedDate,
            item.LastAccessedDate,
            ShortUrl = BuildShortUrl(item.Code),
        };
    }

    private string BuildShortUrl(string code)
    {
        return $"{Request.Scheme}://{Request.Host}/s/{code}";
    }
}

public class CreateShortLinkArgs
{
    public string Url { get; set; } = string.Empty;
}
