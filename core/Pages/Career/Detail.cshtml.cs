using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;

namespace Waffle.Pages.Career;

public class DetailModel(ICatalogService catalogService) : DynamicPageModel(catalogService)
{
    public IEnumerable<ComponentListItem>? Components;

    public async Task<IActionResult> OnGetAsync()
    {
        Components = await _catalogService.ListComponentAsync(PageData.Id);
        return Page();
    }
}
