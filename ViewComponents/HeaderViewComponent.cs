using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IServices;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class HeaderViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        private readonly ICatalogService _catalogService;
        public HeaderViewComponent(ApplicationDbContext context, ICatalogService catalogService)
        {
            _context = context;
            _catalogService = catalogService;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var catalog = await _catalogService.EnsureDataAsync(nameof(Header));

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
            ViewBag.Items = items;
            return View();
        }
    }
}
