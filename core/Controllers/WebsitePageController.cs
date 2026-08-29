using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Website;

namespace Waffle.Controllers;

public class WebsitePageController(ApplicationDbContext context) : BaseController
{
    private const string HomePageKey = "home";
    private const string EmptyDocument = "{\"version\":1,\"blocks\":[]}";

    [HttpGet("home"), AllowAnonymous]
    public async Task<IActionResult> GetHomeAsync()
    {
        var page = await context.WebsitePages.AsNoTracking()
            .SingleOrDefaultAsync(x => x.PageKey == HomePageKey && x.IsPublished);

        return Ok(new
        {
            content = ParseContent(page?.Content ?? EmptyDocument),
            isPublished = page?.IsPublished ?? false
        });
    }

    [HttpGet("home/edit"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> GetHomeForEditingAsync()
    {
        var page = await context.WebsitePages.AsNoTracking()
            .SingleOrDefaultAsync(x => x.PageKey == HomePageKey);

        return Ok(new
        {
            content = ParseContent(page?.Content ?? EmptyDocument),
            isPublished = page?.IsPublished ?? false
        });
    }

    [HttpPut("home"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> SaveHomeAsync([FromBody] WebsitePageUpdateArgs args)
    {
        if (args.Content.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null or not JsonValueKind.Object)
        {
            return BadRequest("Content must be a JSON object.");
        }

        var page = await context.WebsitePages.SingleOrDefaultAsync(x => x.PageKey == HomePageKey);
        if (page is null)
        {
            page = new WebsitePage { PageKey = HomePageKey };
            context.WebsitePages.Add(page);
        }

        page.Content = args.Content.GetRawText();
        page.IsPublished = args.IsPublished;
        await context.SaveChangesAsync();

        return Ok(new { succeeded = true });
    }

    private static JsonElement ParseContent(string content)
    {
        using var document = JsonDocument.Parse(content);
        return document.RootElement.Clone();
    }
}