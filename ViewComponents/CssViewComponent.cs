using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Services.Catalogs;
using Waffle.Data;
using Waffle.Models.Components;
using Waffle.Models;
using Microsoft.EntityFrameworkCore;

namespace Waffle.ViewComponents
{
    public class CssViewComponent: ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public CssViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent != null)
            {
                ViewBag.CSS = $"/css/{workContent.Id}.css";
            }
            return View();
        }
    }
}
