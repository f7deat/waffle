using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Article
{
    public class TagModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly IWorkService _workService;
        public TagModel(IWorkService workService, ICatalogService catalogService)
        {
            _workService = workService;
            _catalogService = catalogService;
        }
        public IEnumerable<Catalog>? Articles;

        public async Task OnGetAsync(Guid id)
        {
            var work = await _workService.FindAsync(id);
            if (work != null)
            {
                ViewData["Title"] = work.Name;
            }
            var articles = await _catalogService.ArticleRelatedListAsync(new ArticleRelatedFilterOption
            {
                CatalogId = Guid.Empty,
                WorkId = id,
                Current = 1,
                PageSize = 12
            });
            Articles = articles.Data;
        }
    }
}
