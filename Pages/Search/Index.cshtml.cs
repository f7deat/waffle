using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Helpers;
using Waffle.ExternalAPI.Google;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;

namespace Waffle.Pages.Search
{
    public class IndexModel : PageModel
    {
        private readonly IGoogleService _googleService;
        public IndexModel(IGoogleService googleService)
        {
            _googleService = googleService;
            FilterOptions = new SearchFilterOptions
            {
                Current = 1,
                PageSize = 10
            };
        }

        [BindProperty(SupportsGet = true)]
        public SearchFilterOptions FilterOptions { get; set; }
        public List<ChannelItem>? Keys;

        public async Task<IActionResult> OnGetAsync()
        {
            if (FilterOptions.Current < 1)
            {
                return NotFound();
            }
            ViewData["Title"] = FilterOptions.SearchTerm;
            var response = await _googleService.GetDailyTrendingAsync();
            var trend = XmlHelper.Deserialize<TrendModel>(response);
            Keys = trend?.Channel?.Item;
            return Page();
        }
    }
}
