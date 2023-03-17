using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Article
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
            FilterOptions = new CatalogFilterOptions
            {
                Current = 1,
                PageSize = 12,
                Type = CatalogType.Article
            };
        }

        [BindProperty(SupportsGet = true)]
        public CatalogFilterOptions FilterOptions { get; set; }

        public ListResult<Catalog>? Articles;

        public async Task OnGetAsync()
        {
            Articles = await _catalogService.ListAsync(FilterOptions);
        }
    }
}
