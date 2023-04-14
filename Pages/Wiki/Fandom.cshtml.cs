using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.Pages.Wiki
{
    public class FandomModel : PageModel
    {
        private readonly IWikiService _wikiService;
        public FandomModel(IWikiService wikiService)
        {
            _wikiService = wikiService;
        }

        public Parse Data = new();

        public async Task<IActionResult> OnGetAsync(string id, string lang = "vi")
        {
            var response = await _wikiService.FandomAsync(id, "you-zitsu", "vi");
            if (response is null)
            {
                return NotFound();
            }
            Data = response;
            ViewData["Title"] = Data.Title;
            ViewData["Description"] = Data.Title;
            return Page();
        }
    }
}
