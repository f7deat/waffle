using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Catalogs.Args;
using Waffle.Core.Services.Tags.Filters;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Args.Catalogs;
using Waffle.Models.Components;
using Waffle.Models.Filters.Catalogs;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers;

public class CatalogController(ApplicationDbContext _context, ICatalogService _catalogService, ILogService logService) : BaseController
{
    [HttpGet("view-count")]
    public async Task<IActionResult> GetViewCountAsync([FromQuery] string locale) => Ok(await _catalogService.GetViewCountAsync(locale));

    [HttpGet("{id}")]
    public async Task<IActionResult> DetailAsync([FromRoute] Guid id) => Ok(await _catalogService.DetailAsync(id));

    [HttpGet("type/{id}")]
    public async Task<IActionResult> GetTypeAsync([FromRoute] CatalogType id) => Ok(new { data = await _catalogService.GetTypeAsync(id) });

    [HttpGet("name/{normalizedName}")]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string normalizedName) => Ok(await _catalogService.GetByNameAsync(normalizedName));

    [HttpGet("name/{parent}/{normalizedName}")]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string parent, [FromRoute] string normalizedName)
    {
        normalizedName = parent + "/" + normalizedName;
        return Ok(await _catalogService.GetByNameAsync(normalizedName));
    }

    [HttpPost, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> AddAsync([FromBody] Catalog catalog, [FromQuery] string locale)
    {
        if (!LocaleHelper.IsAvailable(locale)) return BadRequest("Locale not avaiable!");
        catalog.Locale = locale;
        if (string.IsNullOrWhiteSpace(catalog.Name)) return BadRequest("Please enter name!");
        return Ok(await _catalogService.AddAsync(catalog));
    }

    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> ListAsync([FromQuery] CatalogFilterOptions filterOptions) => Ok(await _catalogService.ListAsync(filterOptions));

    [HttpGet("tree")]
    public async Task<IActionResult> TreeAsync()
    {
        var returnValue = new List<Tree>();
        var parrent = await _context.Catalogs.Where(x => x.Active && x.ParentId == null && x.Type != CatalogType.Entry).ToListAsync();
        foreach (var catalog in parrent)
        {
            List<Tree>? children = null;
            if (await _context.Catalogs.AnyAsync(x => x.ParentId == catalog.ParentId))
            {
                children = await _context.Catalogs.Where(x => x.Active && x.ParentId == catalog.Id).Select(x => new Tree
                {
                    Key = x.Id,
                    Title = x.Name
                }).ToListAsync();
            }
            returnValue.Add(new Tree
            {
                Key = catalog.Id,
                Title = catalog.Name,
                Icon = GetIcon(catalog.Type),
                Children = children
            });
        }
        return Ok(returnValue);
    }

    private static string GetIcon(CatalogType type)
    {
        switch (type)
        {
            case CatalogType.Entry:
                return "🏠";
            default:
                return "🗍";
        }
    }

    [HttpPost("delete/{id}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        try
        {
            var catalog = await _catalogService.FindAsync(id);
            if (catalog is null) return BadRequest("Catalog not found!");

            if (await _catalogService.HasChildAsync(catalog.Id)) return BadRequest("Please remove child catalog!");

            if (await _context.WorkItems.AnyAsync(x => x.CatalogId == id)) return BadRequest("Please remove work item!");

            var products = await _context.Products.Where(x => x.CatalogId == catalog.Id).ToListAsync();
            if (products.Count > 0)
            {
                _context.Products.RemoveRange(products);
            }

            var tags = await _context.WorkItems.Where(x => x.WorkId == id).ToListAsync();
            if (tags.Count > 0)
            {
                _context.WorkItems.RemoveRange(tags);
            }
            var room = await _context.Rooms.FirstOrDefaultAsync(x => x.CatalogId == id);
            if (room != null)
            {
                _context.Rooms.Remove(room);
            }
            await logService.AddAsync($"Delete catalog: {catalog.Name}", id);
            await _catalogService.DeleteAsync(catalog);

            return Ok(IdentityResult.Success);
        }
        catch (Exception ex)
        {
            await logService.ExceptionAsync(ex);
            return BadRequest(ex.ToString());
        }
    }

    [HttpPost("active/{id}")]
    public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await _catalogService.ActiveAsync(id));

    [HttpPost("save"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> SaveAsync([FromBody] Catalog args) => Ok(await _catalogService.SaveAsync(args));

    [HttpPost("tree-drop")]
    public async Task<IActionResult> DropAsync([FromBody] DropModel model)
    {
        var drop = await _catalogService.FindAsync(model.DragNodeKey);
        if (drop is null)
        {
            return Ok(IdentityResult.Failed());
        }
        var node = await _catalogService.FindAsync(model.Node);
        if (node is null)
        {
            return Ok(IdentityResult.Failed());
        }
        drop.ParentId = model.Node;
        if (model.DropToGap)
        {
            drop.ParentId = null;
        }
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpGet("categories/{type}")]
    public async Task<IActionResult> GetCategoriesAsync([FromRoute] CatalogType type) => Ok(await _context.Catalogs.Where(x => x.Type == type).ToListAsync());

    [HttpPost("update-thumbnail")]
    public async Task<IActionResult> UpdateThumbnailAsync([FromBody] Catalog args) => Ok(await _catalogService.UpdateThumbnailAsync(args));

    [HttpGet("types")]
    public IActionResult GetTypes() => Ok(_catalogService.GetTypesAsync());

    [HttpGet("list-tag/{id}")]
    public async Task<IActionResult> ListTagByIdAsync([FromRoute] Guid id) => Ok(await _catalogService.ListTagByIdAsync(id));

    [HttpGet("list-tag-select")]
    public async Task<IActionResult> ListTagAsync([FromQuery] TagFilterOptions filterOptions) => Ok(await _catalogService.ListTagSelectAsync(filterOptions));

    [HttpPost("tag/add-to-catalog")]
    public async Task<IActionResult> TagAddToCatalogAsync([FromBody] WorkItem args) => Ok(await _catalogService.TagAddToCatalogAsync(args));

    [HttpGet("list-by-tag/{id}")]
    public async Task<IActionResult> ListByTagAsync([FromRoute] Guid id, SearchFilterOptions filterOptions) => Ok(await _catalogService.ListByTagAsync(id, new CatalogFilterOptions
    {
        Name = filterOptions.SearchTerm,
    }));

    [HttpGet("pie-chart")]
    public async Task<IActionResult> PieChartAsync([FromQuery] string locale) => Ok(await _catalogService.PieChartAsync(locale));

    [HttpGet("top-view")]
    public async Task<IActionResult> GetTopViewAsync([FromQuery] CatalogType type, [FromQuery] string locale) => Ok(await _catalogService.GetTopViewAsync(type, locale));

    [HttpGet("form-select")]
    public async Task<IActionResult> GetFormSelectAsync([FromQuery] SelectOptions filterOptions) => Ok(await _catalogService.GetFormSelectAsync(filterOptions));

    [HttpGet("structure-by-id/{id}")]
    public async Task<IActionResult> GetStructureByIdAsync([FromRoute] Guid id) => Ok(await _catalogService.GetStructureByIdAsync(id));

    [HttpGet("structure/{normalizedName}")]
    public async Task<IActionResult> GetStructureAsync([FromRoute] string normalizedName) => Ok(await _catalogService.GetStructureAsync(normalizedName));

    [HttpGet("components")]
    public async Task<IActionResult> GetComponentsAsync([FromQuery] GetComponentsArgs args)
    {
        if (args is null || string.IsNullOrWhiteSpace(args.NormalizedName) || string.IsNullOrWhiteSpace(args.Locale)) return BadRequest();
        return Ok(await _catalogService.GetComponentsAsync(args));
    }

    [HttpPost("delete-range")]
    public async Task<IActionResult> DeleteRangeAsync([FromBody] List<Guid> ids)
    {
        if (ids is null || !ids.Any()) return BadRequest("No catalog selected!");
        return Ok(await _catalogService.DeleteRangeAsync(ids));
    }

    [HttpPost("setting/save/{id}")]
    public async Task<IActionResult> SaveSettingAsync([FromRoute] Guid id, [FromBody] CatalogSetting args)
    {
        var catalog = await _catalogService.FindAsync(id);
        if (catalog is null) return BadRequest("Catalog not found");
        catalog.Setting = JsonConvert.SerializeObject(args);
        return Ok(await _catalogService.SaveSettingAsync(catalog));
    }

    [HttpGet("setting/{id}")]
    public async Task<IActionResult> GetSettingAsync([FromRoute] Guid id)
    {
        var catalog = await _catalogService.FindAsync(id);
        if (catalog is null) return BadRequest("Catalog not found");
        if (string.IsNullOrEmpty(catalog.Setting)) return Ok(new CatalogSetting());
        return Ok(JsonConvert.DeserializeObject<CatalogSetting>(catalog.Setting));
    }

    [HttpGet("url-options")]
    public async Task<IActionResult> GetUrlOptionsAsync([FromQuery] UrlCatalogOptions filterOptions) => Ok(await _catalogService.GetUrlOptionsAsync(filterOptions));

    [HttpPost("tag/create")]
    public async Task<IActionResult> CreateTagAsync([FromBody] CreateTagArgs args, [FromQuery] string locale)
    {
        var result = await _catalogService.CreateTagAsync(args, locale);
        if (!result.Succeeded) return BadRequest(result.Message);
        return CreatedAtAction(nameof(CreateTagAsync), result);
    }

    [HttpGet("options")]
    public async Task<IActionResult> GetOptionsAsync([FromQuery] CatalogSelectOptions filterOptions) => Ok(await _catalogService.GetOptionsAsync(filterOptions));

    [HttpGet("list-type")]
    public async Task<IActionResult> ListTypeAsync() => Ok(new { data = await _catalogService.ListTypeAsync() });

    [HttpGet("meta/{slug}"), AllowAnonymous]
    public async Task<IActionResult> GetMetaAsync([FromRoute] string slug ) => Ok(await _catalogService.GetMetaAsync(slug));

    [HttpGet("tags"), AllowAnonymous]
    public async Task<IActionResult> GetTagsAsync([FromQuery] Guid catalogId) => Ok(await _catalogService.TagsAsync(catalogId));

    [HttpPost("tags")]
    public async Task<IActionResult> SaveTagsAsync([FromBody] SaveCatalogTagsArgs args) => Ok(await _catalogService.SaveTagsAsync(args));
}
