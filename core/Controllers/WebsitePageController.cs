using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Website;

namespace Waffle.Controllers;

[Route("api/website-page")]
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
        try
        {
            if (args.Content.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null or not JsonValueKind.Object)
            {
                return BadRequest("Content must be a JSON object.");
            }
            if (!IsValidDocument(args.Content))
            {
                return BadRequest("Content must contain valid website blocks.");
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

            return Ok(TResult.Success);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    private static JsonElement ParseContent(string content)
    {
        using var document = JsonDocument.Parse(content);
        return document.RootElement.Clone();
    }

    private static bool IsValidDocument(JsonElement content)
    {
        return content.TryGetProperty("blocks", out var blocks) && blocks.ValueKind == JsonValueKind.Array
            && blocks.EnumerateArray().All(IsValidBlock);
    }

    private static bool IsValidBlock(JsonElement block)
    {
        if (block.ValueKind != JsonValueKind.Object
            || !block.TryGetProperty("id", out var id) || id.ValueKind != JsonValueKind.String
            || !block.TryGetProperty("type", out var type) || type.ValueKind != JsonValueKind.String
            || !block.TryGetProperty("settings", out var settings) || settings.ValueKind != JsonValueKind.Object)
        {
            return false;
        }

        var blockType = type.GetString();
        if (blockType is not ("hero" or "richText" or "featureGrid" or "image" or "cta" or "row" or "col")) return false;
        var isContainer = blockType is "row" or "col";
        if (!block.TryGetProperty("children", out var children)) return !isContainer;
        return isContainer && children.ValueKind == JsonValueKind.Array && children.EnumerateArray().All(IsValidBlock);
    }
}