using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers
{
    public class CatalogController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly ICatalogService _catalogService;
        public CatalogController(ApplicationDbContext context, ICatalogService catalogService)
        {
            _context = context;
            _catalogService = catalogService;
        }

        [HttpGet("view-count")]
        public async Task<IActionResult> GetViewCountAsync() => Ok(await _context.Catalogs.SumAsync(x => x.ViewCount));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _catalogService.FindAsync(id));

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] Catalog catalog) => Ok(await _catalogService.AddAsync(catalog));

        [HttpGet("list")]
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
                case CatalogType.Setting:
                    return "⚙️";
                default:
                    return "🗍";
            }
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            var catalog = await _context.Catalogs.FindAsync(id);
            if (catalog is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Catalog not found!"
                }));
            }
            if (await _context.Catalogs.AnyAsync(x => x.ParentId == catalog.Id))
            {
                return Ok(IdentityResult.Failed(new IdentityError { Description = "Please remove child catalog first!" }));
            }

            var workItem = await _context.WorkItems.Where(x => x.CatalogId == id).ToListAsync();
            _context.RemoveRange(workItem);

            _context.Catalogs.Remove(catalog);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("active/{id}")]
        public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await _catalogService.ActiveAsync(id));

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] Catalog args) => Ok(await _catalogService.SaveAsync(args));

        [HttpPost("tree-drop")]
        public async Task<IActionResult> DropAsync([FromBody] DropModel model)
        {
            var drop = await _context.Catalogs.FindAsync(model.DragNodeKey);
            if (drop is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var node = await _context.Catalogs.FindAsync(model.Node);
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

        [HttpPost("article/save")]
        public async Task<IActionResult> ArticleSaveAsync([FromBody] Catalog args) => Ok(await _catalogService.ArticleSaveAsync(args));

        [HttpPost("update-thumbnail")]
        public async Task<IActionResult> UpdateThumbnailAsync([FromBody] Catalog args) => Ok(await _catalogService.UpdateThumbnailAsync(args));

        [HttpGet("types")]
        public IActionResult GetTypes() => Ok(_catalogService.GetTypes());

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
        public async Task<IActionResult> PieChartAsync() => Ok(await _catalogService.PieChartAsync());
    }
}
