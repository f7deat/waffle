using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Web;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.Pages.Wiki
{
    public class DetailModel : PageModel
    {
        private readonly IWikiService _wikiService;
        public DetailModel(IWikiService wikiService)
        {
            _wikiService = wikiService;
        }

        public Parse Data = new();

        public async Task<IActionResult> OnGetAsync(string id, string lang = "vi")
        {
            var response = await _wikiService.ParseAsync(id, lang);
            if (response is null)
            {
                return Redirect($"/wiki/try-another-language/{HttpUtility.UrlEncode(id)}");
            }
            Data = response;
            ViewData["Title"] = Data.Title;
            ViewData["Description"] = Data.Title;
            return Page();
        }
    }
}
