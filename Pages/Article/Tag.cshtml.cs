using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Catalogs;

namespace Waffle.Pages.Article
{
    public class TagModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly ICatalogService _catalogService;
        public TagModel(ApplicationDbContext context, ICatalogService catalogService)
        {
            _context = context;
            _catalogService = catalogService;
        }
        public IEnumerable<ArticleListItem>? Articles;

        public async Task OnGetAsync(Guid id)
        {
            var work = await _context.WorkContents.FindAsync(id);
            if (work != null)
            {
                ViewData["Title"] = work.Name;
            }
            var articles = await _catalogService.ArticleListAsync(new ArticleFilterOptions
            {
                PageSize = 12,
                Current = 1
            });
            Articles = articles.Data;
        }
    }
}
