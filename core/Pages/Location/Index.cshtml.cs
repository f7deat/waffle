using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Location;

public class IndexModel(ICatalogService catalogService) : EntryPageModel(catalogService)
{
    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;

    public ListResult<CatalogListItem>? Catalogs;
    public IEnumerable<ComponentListItem> Components = [];

    public async Task OnGetAsync()
    {
        Components = await _catalogService.ListComponentAsync(PageData.Id);
        Catalogs = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            PageSize = 12,
            Current = Current,
            Type = CatalogType.Location,
            Locale = PageData.Locale 
        });
    }
}
