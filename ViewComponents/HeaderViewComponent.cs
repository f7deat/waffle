using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class HeaderViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public HeaderViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => nameof(Header).ToLower().Equals(x.NormalizedName));
            if (catalog is null)
            {
                catalog = new Entities.Catalog
                {
                    Name = "Home",
                    NormalizedName = "home"
                };
                await _context.Catalogs.AddAsync(catalog);
                await _context.SaveChangesAsync();
            }
            var items = from a in _context.WorkContents
                        join b in _context.WorkItems on a.Id equals b.WorkContentId
                        join c in _context.Components on a.ComponentId equals c.Id
                        where b.CatalogId == catalog.Id
                        orderby b.SortOrder ascending
                        select new ComponentListItem
                        {
                            Name = c.NormalizedName,
                            Id = a.Id
                        };
            return View(items);
        }
    }
}
