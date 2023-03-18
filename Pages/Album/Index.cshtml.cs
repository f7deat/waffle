using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.AppSettings;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Album
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly IFacebookService _facebookService;
        private readonly IAppSettingService _appService;
        public IndexModel(ICatalogService catalogService, IFacebookService facebookService, IAppSettingService appService)
        {
            _catalogService = catalogService;
            _facebookService = facebookService;
            _appService = appService;
        }

        public List<ExternalAPI.Models.Album> Albums = new();
        public Catalog Catalog = new();

        public async Task<IActionResult> OnGetAsync()
        {
            Catalog = await _catalogService.EnsureDataAsync(nameof(Album), CatalogType.Entry);
            ViewData["Title"] = Catalog.Name;
            ViewData["Description"] = Catalog.Description;

            var app = await _appService.GetAsync<ExternalAPI.Models.Facebook>(nameof(Facebook));
            if (app != null)
            {
                Albums = await _facebookService.GetAlbumsAsync(app.PageId, app.PageAccessToken);
            }

            return Page();
        }
    }
}
