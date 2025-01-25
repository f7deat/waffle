using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Collection;

public class DetailModel(ICatalogService catalogService, ICollectionService _collectionService) : DynamicPageModel(catalogService)
{
    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;
    public ListResult<CatalogListItem>? Catalogs;
    public async Task OnGetAsync()
    {
        Catalogs = await _collectionService.ListCatalogByCollectionAsync(new ListCatalogCollectionFilterOptions
        {
            PageSize = 12,
            Current = Current,
            CatalogId = PageData.Id
        });
    }
}
