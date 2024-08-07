using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Locations;

public class IndexModel : EntryPageModel
{
    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;

    public ListResult<CatalogListItem>? Catalogs;

    public IndexModel(ICatalogService catalogService) : base(catalogService)
    {
    }

    public IEnumerable<ComponentListItem> Components = new List<ComponentListItem>();

    public async Task OnGetAsync()
    {
        Components = await _catalogService.ListComponentAsync(PageData.Id);
        Catalogs = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            PageSize = 12,
            Current = Current,
            Type = CatalogType.Location
        });
    }
}
