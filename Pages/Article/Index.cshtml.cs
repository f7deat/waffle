using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Pages.Article
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Catalog>? Articles;

        public async Task OnGetAsync()
        {
            Articles = await _context.Catalogs.Where(x => x.Type == CatalogType.Article).ToListAsync();
        }
    }
}
