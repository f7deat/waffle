using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Album
{
    public class IndexModel : EntryPageModel
    {
        private readonly IFacebookService _facebookService;
        private readonly ISettingService _appService;
        public IndexModel(ICatalogService catalogService, IFacebookService facebookService, ISettingService appService) : base(catalogService)
        {
            _facebookService = facebookService;
            _appService = appService;
        }

        public List<ExternalAPI.Models.Album> Albums = new();

        public async Task<IActionResult> OnGetAsync()
        {
            var app = await _appService.GetAsync<ExternalAPI.Models.Facebook>(nameof(Facebook));
            if (app != null)
            {
                Albums = await _facebookService.GetAlbumsAsync(app.PageId, app.PageAccessToken);
            }
            return Page();
        }
    }
}
