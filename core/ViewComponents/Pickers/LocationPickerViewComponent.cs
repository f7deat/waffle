using Waffle.Core.Foundations;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components.Pickers;

namespace Waffle.ViewComponents.Pickers;

public class LocationPickerViewComponent(IWorkService workService, ICatalogService _catalogService) : BaseViewComponent<LocationPicker>(workService)
{
    protected override async Task<LocationPicker> ExtendAsync(LocationPicker work)
    {
        var locations = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Type = CatalogType.Location,
            Active = true,
            PageSize = 5,
            Locale = PageData.Locale
        });
        work.Locations = locations.Data?.ToList() ?? [];
        return work;
    }
}
