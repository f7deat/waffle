using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Catalogs;

namespace Waffle.Pages.Article
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<ArticleListItem>? Articles;

        public async Task OnGetAsync()
        {
            Articles = await _context.Catalogs.Where(x => x.Type == CatalogType.Article).Select(x => new ArticleListItem
            {
                Description = x.Description,
                Name = x.Name,
                ModifiedDate = x.ModifiedDate ?? x.CreatedDate,
                NomalizedName = x.NormalizedName,
                Thumbnail = x.Thumbnail,
                ViewCount = x.ViewCount,
                Id = x.Id
            }).ToListAsync();
        }
    }
}
