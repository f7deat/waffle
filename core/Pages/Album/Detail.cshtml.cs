using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;

namespace Waffle.Pages.Album;

public class DetailModel : DynamicPageModel
{
    public DetailModel(ICatalogService catalogService) : base(catalogService)
    {
    }


    public IEnumerable<ComponentListItem>? Components;

    public async Task<IActionResult> OnGetAsync()
    {
        if (PageData.Type == Entities.CatalogType.Product)
        {
            return RedirectPermanent(PageData.Url);
        }
        Components = await _catalogService.ListComponentAsync(PageData.Id);
        return Page();
    }
}
