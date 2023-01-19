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
            FilterOptions = new ArticleFilterOptions
            {
                Current = 1,
                PageSize = 12
            };
        }

        [BindProperty(SupportsGet = true)]
        public ArticleFilterOptions FilterOptions { get; set; }

        public ListResult<ArticleListItem>? Articles;

        public async Task OnGetAsync()
        {
            Articles = await _catalogService.ArticleListAsync(FilterOptions);
        }
    }
}
