using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Album.Facebook
{
    public class IndexModel : PageModel
    {
        private readonly IFacebookService _facebookService;
        private readonly ISettingService _appService;
        public IndexModel(IFacebookService facebookService, ISettingService appSettingService)
        {
            _facebookService = facebookService;
            _appService = appSettingService;
        }

        public FacebookListResult<FacebookPhoto>? Photos;
        [BindProperty(SupportsGet = true)]
        public int Current { get; set; } = 1;
        [BindProperty(SupportsGet = true)]
        public int Limit { get; set; } = 12;
        [BindProperty(SupportsGet = true)]
        public string Before { get; set; } = string.Empty;
        [BindProperty(SupportsGet = true)]
        public string After { get; set; } = string.Empty;
        private string Id = string.Empty;

        public Pagination Pagination => new()
        { 
            NextToken = Photos?.Paging?.Cursors?.After,
            PrevToken = Photos?.Paging?.Cursors?.Before,
            NextPageUrl = $"/album/facebook/{Id}?after={Photos?.Paging?.Cursors?.After}",
            PrevPageUrl = $"/album/facebook/{Id}?before={Photos?.Paging?.Cursors?.Before}",
            Type = PaginationType.Token
        };

        public async Task<IActionResult> OnGetAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }
            Id = id;
            var app = await _appService.GetAsync<ExternalAPI.Models.Facebook>(nameof(Facebook));
            if (app == null)
            {
                return NotFound();
            }
            Photos = await _facebookService.GetPhotosAsync(id, 12, Before, After, app.PageAccessToken);

            var summary = await _facebookService.GetSummaryAsync(id, app.PageAccessToken);
            ViewData["Title"] = summary.Name;
            ViewData["Description"] = summary.Description;

            return Page();
        }
    }
}
