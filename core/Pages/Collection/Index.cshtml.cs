using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Collection;

public class IndexModel(ICatalogService catalogService) : EntryPageModel(catalogService)
{
    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;
    public ListResult<CatalogListItem>? Catalogs;
    public async Task OnGetAsync()
    {
        Catalogs = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            Type = CatalogType.Collection,
            PageSize = 12,
            Current = Current
        });
    }
}
