using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using System.Web;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Pages.Wiki;

public class DetailModel : PageModel
{
    private readonly IWikiService _wikiService;
    private readonly ICatalogService _catalogService;
    private readonly IProductService _productService;
    private readonly SettingOptions Options;

    public DetailModel(IWikiService wikiService, ICatalogService catalogService, IProductService productService, IOptions<SettingOptions> options)
    {
        _wikiService = wikiService;
        _catalogService = catalogService;
        _productService = productService;
        Options = options.Value;
    }

    public Parse Data = new();
    public IEnumerable<Catalog> Articles = new List<Catalog>();
    public IEnumerable<ProductListItem> Products = new List<ProductListItem>();

    public async Task<IActionResult> OnGetAsync(string id, string lang = "vi")
    {
        if (Options.Theme != "Default") return NotFound();
        var response = await _wikiService.ParseAsync(id, lang);
        if (response is null)
        {
            return Redirect($"/search?searchTerm={HttpUtility.UrlEncode(id)}");
        }
        Data = response;
        ViewData["Title"] = Data.Title;
        ViewData["Description"] = Data.Title;
        Articles = await _catalogService.ListSpotlightAsync(CatalogType.Article, 4);
        Products = await _productService.ListSpotlightAsync(6, new List<Guid>());
        
        return Page();
    }
}
