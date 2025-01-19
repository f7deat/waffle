using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;

namespace Waffle.ViewComponents;

public class CollectionViewComponent(ICollectionService _collectionService) : ViewComponent
{
    protected PageData PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(PageData), out var values);
            return values as PageData ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var catalogs = await _collectionService.GetListCatalogAsync(new ListCatalogCollectionFilterOptions
        {
            CatalogId = PageData.Id,
            Current = 1,
            Locale = PageData.Locale,
            PageSize = 10
        });
        var collection = await _collectionService.FindByCatalogAsync(PageData.Id);
        if (!catalogs.HasData)
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = Guid.Empty.ToString()
            });
        }
        return View(new CollectionComponent
        {
            Catalogs = catalogs.Data,
            Title = collection?.Name
        });
    }
}
