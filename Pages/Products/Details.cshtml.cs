using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Products;

public class DetailsModel : DynamicPageModel
{
    private readonly ApplicationDbContext _context;

    public DetailsModel(ICatalogService catalogService, ApplicationDbContext context) : base(catalogService)
    {
        _context = context;
    }

    public WorkListItem? Editor;
    public IEnumerable<Catalog> Tags = new List<Catalog>();
    public Guid ProductImage;

    public async Task<IActionResult> OnGetAsync()
    {
        Tags = await _catalogService.ListTagByIdAsync(PageData.Id);
        var component = await GetComponentsAsync();
        if (component.Any())
        {
            Editor = component.FirstOrDefault(x => x.NormalizedName == nameof(Editor));
            ProductImage = component.FirstOrDefault(x => x.NormalizedName == nameof(ProductImage))?.Id ?? Guid.Empty;
        }
        return Page();
    }

    private async Task<List<WorkListItem>> GetComponentsAsync()
    {
        var query = from a in _context.WorkItems
                    join b in _context.WorkContents on a.WorkId equals b.Id
                    join c in _context.Components on b.ComponentId equals c.Id
                    where a.CatalogId == PageData.Id && b.Active
                    orderby a.SortOrder
                    select new WorkListItem
                    {
                        Id = b.Id,
                        Name = b.Name,
                        NormalizedName = c.NormalizedName
                    };
        return await query.ToListAsync();
    }
}
