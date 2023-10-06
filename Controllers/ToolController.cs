using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Foundations;
using Waffle.Models.Components;
using Waffle.Models.Params.Tools;

namespace Waffle.Controllers;

public class ToolController : BaseController
{
    private readonly ICatalogService _catalogService;
    private readonly IWordPressService _wordPressService;
    private readonly IComponentService _componentService;
    private readonly IWorkService _workService;

    public ToolController(ICatalogService catalogService, IWordPressService wordPressService, IComponentService componentService, IWorkService workService)
    {
        _catalogService = catalogService;
        _wordPressService = wordPressService;
        _componentService = componentService;
        _workService = workService;
    }

    [HttpPost("fetch-wordpress")]
    public async Task<IActionResult> FetchWordPressAsync([FromBody] FetchWordPressArgs args)
    {
        if (string.IsNullOrEmpty(args.Domain)) return BadRequest("No domain found!");
        if (!args.Domain.EndsWith("/"))
        {
            args.Domain += "/";
        }
        if (args.CatalogId != null)
        {
            var parent = await _catalogService.FindAsync(args.CatalogId ?? Guid.Empty);
            if (parent is null) return BadRequest("Catalog not found!");
        }
        var current = 1;
        var editor = await _componentService.GetByNameAsync(nameof(Editor));
        if (editor is null) return BadRequest("Editor not found!");
        while (true)
        {
            var posts = await _wordPressService.ListPostAsync(args.Domain, new Models.SearchFilterOptions
            {
                Current = current
            });
            if (posts is null) break;
            foreach (var post in posts)
            {
                var article = new Catalog
                {
                    Active = true,
                    CreatedBy = User.GetId(),
                    CreatedDate = DateTime.Now,
                    Description = post.Title.Rendered,
                    ModifiedDate = DateTime.Now,
                    Name = post.Title.Rendered ?? string.Empty,
                    NormalizedName = post.Slug ?? string.Empty,
                    ParentId = args.CatalogId,
                    ViewCount = 0,
                    Type = CatalogType.Article,
                    Thumbnail = "/imgs/search-engines-amico.svg"
                };
                await _catalogService.AddAsync(article);
                var content = string.Empty;
                if (!string.IsNullOrEmpty(post.Content.Rendered))
                {
                    content = post.Content.Rendered.Replace(args.Domain, "/");
                }
                var arguments = new Editor
                {
                    Blocks = new List<BlockEditorBlock>
                    {
                        new BlockEditorBlock
                        {
                            Type = BlockEditorType.RAW,
                            Data = new BlockEditorItemData
                            {
                                Html = post.Content.Rendered
                            }
                        }
                    }
                };
                var work = new WorkContent
                {
                    ComponentId = editor.Id,
                    Active = true,
                    Arguments = JsonSerializer.Serialize(arguments),
                    Name = "WordPress content"
                };
                await _workService.AddAsync(work);
                await _workService.AddItemAsync(work.Id, article.Id);
            }
            current++;
        }
        return Ok(IdentityResult.Success);
    }
}
