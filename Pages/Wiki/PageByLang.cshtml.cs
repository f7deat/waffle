using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.Pages.Wiki
{
    public class PageByLangModel : PageModel
    {
        private readonly IWikiService _wikiService;
        public PageByLangModel(IWikiService wikiService)
        {
            _wikiService = wikiService;
        }

        public Parse Data = new();

        public async Task<IActionResult> OnGetAsync(string lang, string id)
        {
            var response = await _wikiService.ParseAsync(id, lang);
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
