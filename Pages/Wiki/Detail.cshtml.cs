using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Wiki;

namespace Waffle.Pages.Wiki
{
    public class DetailModel : PageModel
    {
        private readonly IWikiService _wikiService;
        public DetailModel(IWikiService wikiService)
        {
            _wikiService = wikiService;
        }

        public Parse? Data;

        public async Task<IActionResult> OnGetAsync(string id, string lang = "vi")
        {
            var response = await _wikiService.ParseAsync(id, lang);
            Data = response;
            ViewData["Title"] = response?.Title ?? "Không có dữ liệu!";
            return Page();
        }
    }
}
