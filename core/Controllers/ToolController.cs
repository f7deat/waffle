using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
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
    private readonly ApplicationDbContext _context;

    public ToolController(ICatalogService catalogService, IWordPressService wordPressService, IComponentService componentService, IWorkService workService, ApplicationDbContext context)
    {
        _catalogService = catalogService;
        _wordPressService = wordPressService;
        _componentService = componentService;
        _workService = workService;
        _context = context;
    }

    static string RemoveHtmlTags(string input)
    {
        // Regex to match HTML tags
        string pattern = "<.*?>";
        return Regex.Replace(input, pattern, string.Empty);
    }

    // Get media details by ID
    static async Task<JObject> GetMediaAsync(int mediaId, string domain)
    {
        var uri = new Uri(domain);
        var client = new HttpClient();
        client.BaseAddress = uri;
        var response = await client.GetStringAsync($"wp-json/wp/v2/media/{mediaId}");
        return JObject.Parse(response);
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
        var catalogs = await _context.Catalogs.Select(x => x.NormalizedName).ToListAsync();
        while (true)
        {
            var posts = await _wordPressService.ListPostAsync(args.Domain, new Models.SearchFilterOptions
            {
                Current = current
            });
            if (posts is null) break;
            foreach (var post in posts)
            {
                if (post.Slug is null) continue;
                if (catalogs.Contains(post.Slug)) continue;
                string thumbnail = "/imgs/search-engines-amico.svg";
                try
                {
                    var media = await GetMediaAsync(post.FeaturedMedia ?? 0, args.Domain);
                    thumbnail = media.Value<string>("source_url") ?? "/imgs/search-engines-amico.svg";
                }
                catch (Exception)
                {

                }

                var article = new Catalog
                {
                    Active = true,
                    CreatedBy = User.GetId(),
                    CreatedDate = DateTime.Now,
                    Description = RemoveHtmlTags(post.Excerpt.Rendered ?? string.Empty),
                    ModifiedDate = DateTime.Now,
                    Name = post.Title.Rendered ?? string.Empty,
                    NormalizedName = post.Slug ?? string.Empty,
                    ParentId = args.CatalogId,
                    ViewCount = 0,
                    Type = CatalogType.Article,
                    Thumbnail = thumbnail
                };
                await _catalogService.AddAsync(article);
                var content = string.Empty;
                if (!string.IsNullOrEmpty(post.Content.Rendered))
                {
                    content = post.Content.Rendered.Replace("href=\"" + args.Domain, "href=\"" + "/");
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

    [HttpGet("migrate-product")]
    public async Task<IActionResult> MigrateProductAsync()
    {
        var catalogs = await _context.Catalogs.Where(x => x.Type == CatalogType.Product).ToListAsync();
        foreach (var catalog in catalogs)
        {
            if (await _context.Products.AnyAsync(x => x.CatalogId == catalog.Id)) continue;
            var product = new Product
            {
                CatalogId = catalog.Id
            };
            await _context.Products.AddAsync(product);
        }
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }
}
