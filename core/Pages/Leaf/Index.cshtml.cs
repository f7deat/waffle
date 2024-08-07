using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Leaf;

public class IndexModel : EntryPageModel
{

    public ListResult<CatalogListItem> Catalogs = new();

    public IndexModel(ICatalogService catalogService) : base(catalogService)
    {
    }

    public async Task<IActionResult> OnGetAsync()
    {
        Catalogs = await _catalogService.ListAsync(new()
        {
            Type = CatalogType.Leaf,
            Active = true,
            PageSize = 20
        });
        return Page();
    }
}
