using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Room;

public class DetailModel(ICatalogService catalogService, IRoomService _roomService, ApplicationDbContext _context) : DynamicPageModel(catalogService)
{
    public Entities.Room? Room;

    public List<WorkListItem> Works = new();
    [UIHint(UIHint.Tags)]
    public List<Catalog> Tags = new();
    public bool HasTag => Tags.Any();

    public async Task OnGetAsync()
    {
        Room = await _roomService.GetByCatalogAsync(PageData.Id);
        Works = await GetBlockEditorsAsync();
        Tags = await _catalogService.ListTagByIdAsync(PageData.Id);
    }

    private async Task<List<WorkListItem>> GetBlockEditorsAsync()
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
