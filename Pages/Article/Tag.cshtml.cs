using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Catalogs;

namespace Waffle.Pages.Article
{
    public class TagModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        public TagModel(ApplicationDbContext context)
        {
            _context = context;
        }
        public List<ArticleListItem> Articles = new();

        public async Task OnGetAsync(Guid id)
        {
            var work = await _context.WorkContents.FindAsync(id);
            if (work != null)
            {
                ViewData["Title"] = work.Name;
            } 
            var query = from a in _context.WorkItems
                        join b in _context.Catalogs on a.CatalogId equals b.Id
                        where a.WorkContentId == id && b.Active && b.Type == CatalogType.Article
                        orderby b.ModifiedDate descending
                        select new ArticleListItem
                        {
                            Description = b.Description,
                            Name = b.Name,
                            ModifiedDate = b.ModifiedDate ?? b.CreatedDate,
                            NomalizedName = b.NormalizedName,
                            Thumbnail = b.Thumbnail,
                            ViewCount = b.ViewCount,
                            Id = b.Id
                        };
            Articles = await query.ToListAsync();
        }
    }
}
