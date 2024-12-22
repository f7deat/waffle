using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Waffle.Core.Constants;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Foundations;
using Waffle.Models;
using Waffle.Models.Args.Catalogs;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers;

public class CatalogController(ApplicationDbContext context, ICatalogService catalogService, ILogService logService) : BaseController
{
    [HttpGet("view-count")]
    public async Task<IActionResult> GetViewCountAsync() => Ok(await catalogService.GetViewCountAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await catalogService.FindAsync(id));

    [HttpGet("name/{normalizedName}")]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string normalizedName) => Ok(await catalogService.GetByNameAsync(normalizedName));

    [HttpGet("name/{parent}/{normalizedName}")]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string parent, [FromRoute] string normalizedName)
    {
        normalizedName = parent + "/" + normalizedName;
        return Ok(await catalogService.GetByNameAsync(normalizedName));
    }

    [HttpPost("add"), Authorize]
    public async Task<IActionResult> AddAsync([FromBody] Catalog catalog, [FromQuery] string locale)
    {
        try
        {
            if (!User.IsInRole(RoleName.Admin)) return Unauthorized();
            if (!LocaleHelper.IsAvailable(locale)) return BadRequest("Locale not avaiable!");
            catalog.Locale = locale;
            if (string.IsNullOrWhiteSpace(catalog.Name)) return BadRequest("Please enter name!");
            catalog.Active = catalog.Type == CatalogType.Tag;
            return Ok(await catalogService.AddAsync(catalog));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] CatalogFilterOptions filterOptions) => Ok(await catalogService.ListAsync(filterOptions));

    [HttpGet("tree")]
    public async Task<IActionResult> TreeAsync()
    {
        var returnValue = new List<Tree>();
        var parrent = await context.Catalogs.Where(x => x.Active && x.ParentId == null && x.Type != CatalogType.Entry).ToListAsync();
        foreach (var catalog in parrent)
        {
            List<Tree>? children = null;
            if (await context.Catalogs.AnyAsync(x => x.ParentId == catalog.ParentId))
            {
                children = await context.Catalogs.Where(x => x.Active && x.ParentId == catalog.Id).Select(x => new Tree
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

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        if (!User.IsInRole(RoleName.Admin)) return Unauthorized();
        var catalog = await catalogService.FindAsync(id);
        if (catalog is null) return BadRequest("Catalog not found!");

        if (await catalogService.HasChildAsync(catalog.Id))
        {
            return Ok(IdentityResult.Failed(new IdentityError { Description = "Please remove child catalog first!" }));
        }

        if (await context.WorkItems.AnyAsync(x => x.CatalogId == id)) return BadRequest("Please remove work item!");

        var products = await context.Products.Where(x => x.CatalogId == catalog.Id).ToListAsync();
        if (products.Count > 0)
        {
            context.Products.RemoveRange(products);
        }

        var tags = await context.WorkItems.Where(x => x.WorkId == id).ToListAsync();
        if (tags.Count > 0)
        {
            context.WorkItems.RemoveRange(tags);
        }
        await logService.AddAsync($"Delete catalog: {catalog.Name}", id);
        await catalogService.DeleteAsync(catalog);

        return Ok(IdentityResult.Success);
    }

    [HttpPost("active/{id}")]
    public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await catalogService.ActiveAsync(id));

    [HttpPost("save"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> SaveAsync([FromBody] Catalog args) => Ok(await catalogService.SaveAsync(args));

    [HttpPost("tree-drop")]
    public async Task<IActionResult> DropAsync([FromBody] DropModel model)
    {
        var drop = await catalogService.FindAsync(model.DragNodeKey);
        if (drop is null)
        {
            return Ok(IdentityResult.Failed());
        }
        var node = await catalogService.FindAsync(model.Node);
        if (node is null)
        {
            return Ok(IdentityResult.Failed());
        }
        drop.ParentId = model.Node;
        if (model.DropToGap)
        {
            drop.ParentId = null;
        }
        await context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpGet("categories/{type}")]
    public async Task<IActionResult> GetCategoriesAsync([FromRoute] CatalogType type) => Ok(await context.Catalogs.Where(x => x.Type == type).ToListAsync());

    [HttpPost("update-thumbnail")]
    public async Task<IActionResult> UpdateThumbnailAsync([FromBody] Catalog args) => Ok(await catalogService.UpdateThumbnailAsync(args));

    [HttpGet("types")]
    public IActionResult GetTypes() => Ok(catalogService.GetTypesAsync());

    [HttpGet("list-tag/{id}")]
    public async Task<IActionResult> ListTagByIdAsync([FromRoute] Guid id) => Ok(await catalogService.ListTagByIdAsync(id));

    [HttpGet("list-tag-select")]
    public async Task<IActionResult> ListTagAsync([FromQuery] TagFilterOptions filterOptions) => Ok(await catalogService.ListTagSelectAsync(filterOptions));

    [HttpPost("tag/add-to-catalog")]
    public async Task<IActionResult> TagAddToCatalogAsync([FromBody] WorkItem args) => Ok(await catalogService.TagAddToCatalogAsync(args));

    [HttpGet("list-by-tag/{id}")]
    public async Task<IActionResult> ListByTagAsync([FromRoute] Guid id, SearchFilterOptions filterOptions) => Ok(await catalogService.ListByTagAsync(id, new CatalogFilterOptions
    {
        Name = filterOptions.SearchTerm,
    }));

    [HttpGet("pie-chart")]
    public async Task<IActionResult> PieChartAsync() => Ok(await catalogService.PieChartAsync());

    [HttpGet("top-view")]
    public async Task<IActionResult> GetTopViewAsync([FromQuery] CatalogType type) => Ok(await catalogService.GetTopViewAsync(type));

    [HttpGet("form-select")]
    public async Task<IActionResult> GetFormSelectAsync([FromQuery] SelectFilterOptions filterOptions) => Ok(await catalogService.GetFormSelectAsync(filterOptions));

    [HttpGet("structure-by-id/{id}")]
    public async Task<IActionResult> GetStructureByIdAsync([FromRoute] Guid id) => Ok(await catalogService.GetStructureByIdAsync(id));

    [HttpGet("structure/{normalizedName}")]
    public async Task<IActionResult> GetStructureAsync([FromRoute] string normalizedName) => Ok(await catalogService.GetStructureAsync(normalizedName));

    [HttpGet("components")]
    public async Task<IActionResult> GetComponentsAsync([FromQuery] GetComponentsArgs args)
    {
        if (args is null || string.IsNullOrWhiteSpace(args.NormalizedName) || string.IsNullOrWhiteSpace(args.Locale)) return BadRequest();
        return Ok(await catalogService.GetComponentsAsync(args));
    }

    [HttpPost("delete-range")]
    public async Task<IActionResult> DeleteRangeAsync([FromBody] List<Guid> ids)
    {
        if (ids is null || !ids.Any()) return BadRequest("No catalog selected!");
        return Ok(await catalogService.DeleteRangeAsync(ids));
    }

    [HttpPost("setting/save/{id}")]
    public async Task<IActionResult> SaveSettingAsync([FromRoute] Guid id, [FromBody] CatalogSetting args)
    {
        var catalog = await catalogService.FindAsync(id);
        if (catalog is null) return BadRequest("Catalog not found");
        catalog.Setting = JsonConvert.SerializeObject(args);
        return Ok(await catalogService.SaveSettingAsync(catalog));
    }

    [HttpGet("setting/{id}")]
    public async Task<IActionResult> GetSettingAsync([FromRoute] Guid id)
    {
        var catalog = await catalogService.FindAsync(id);
        if (catalog is null) return BadRequest("Catalog not found");
        if (string.IsNullOrEmpty(catalog.Setting)) return Ok(new CatalogSetting());
        return Ok(JsonConvert.DeserializeObject<CatalogSetting>(catalog.Setting));
    }

    [HttpGet("url-options")]
    public async Task<IActionResult> GetUrlOptionsAsync([FromQuery] OptionFilterOptions filterOptions) => Ok(await catalogService.GetUrlOptionsAsync(filterOptions));
}
