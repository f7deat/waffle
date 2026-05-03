using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Extensions;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
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
