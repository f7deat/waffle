using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Results.Catalogs.Collections;

namespace Waffle.Pages.Collection;

public class DetailModel(ICatalogService catalogService, ICollectionService _collectionService) : DynamicPageModel(catalogService)
{
    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;
    public ListResult<CollectionListItem>? Catalogs;
    public async Task OnGetAsync()
    {
        Catalogs = await _collectionService.ListCatalogByCollectionAsync(new ListCatalogByCollectionFilterOptions
        {
            PageSize = 12,
            Current = Current,
            CollectionId = PageData.Id
        });
    }
}
