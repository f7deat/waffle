using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Page
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
            Catalogs = new List<Catalog>();
            FilterOptions = new BasicFilterOptions();
        }

        public List<Catalog> Catalogs;
        [BindProperty(SupportsGet = true)]
        public BasicFilterOptions FilterOptions { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {
            Catalogs = await _context.Catalogs.Where(x => x.Type == CatalogType.Default && x.Active).Skip((FilterOptions.Current - 1) * FilterOptions.PageSize).Take(FilterOptions.PageSize).ToListAsync();
            return Page();
        }
    }
}
