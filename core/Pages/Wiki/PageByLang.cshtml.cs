using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using Waffle.Core.Options;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.Pages.Wiki;

public class PageByLangModel : PageModel
{
    private readonly IWikiService _wikiService;
    private readonly SettingOptions Options;
    public PageByLangModel(IWikiService wikiService, IOptions<SettingOptions> options)
    {
        _wikiService = wikiService;
        Options = options.Value;
    }

    public Parse Data = new();

    public async Task<IActionResult> OnGetAsync(string lang, string id)
    {
        if (Options.Theme != "Default") return NotFound();
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
