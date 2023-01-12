using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Catalogs;

namespace Waffle.Pages.Article
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public IEnumerable<ArticleListItem>? Articles;

        public async Task OnGetAsync()
        {
            var articles = await _catalogService.ArticleListAsync(new ArticleFilterOptions
            {
                Current = 1,
                PageSize = 12
            });
            Articles = articles.Data;
        }
    }
}
