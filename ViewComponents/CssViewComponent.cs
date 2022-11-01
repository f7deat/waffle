using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;

namespace Waffle.ViewComponents
{
    public class CssViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public CssViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var id = Guid.Parse("4473a4f2-e9c0-4db1-9558-fd99c489a3fa");
            var query = from a in _context.WorkItems
                        join b in _context.WorkContents on a.WorkContentId equals b.Id
                        where a.CatalogId == id
                        orderby a.SortOrder ascending
                        select b;
            return View(await query.ToListAsync());
        }
    }
}
