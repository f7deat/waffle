using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Google.Models;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Blogger
{
    public class DetailsModel : PageModel
    {
        private readonly IGoogleService _googleService;
        public DetailsModel(IGoogleService googleService)
        {
            _googleService = googleService;
        }

        public BloggerItem? Item;

        public async Task OnGetAsync(string id)
        {
            Item = await _googleService.BloggerGetAsync(string.Empty, string.Empty, string.Empty);
        }
    }
}
