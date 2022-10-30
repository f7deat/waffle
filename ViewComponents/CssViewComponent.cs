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
            var data = await _context.WorkItems.Where(x => x.CatalogId == id).ToListAsync();
            if (data is null)
            {
                return View();
            }
            return View(data);
        }
    }
}
