using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.List;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Country;

public class DetailModel(ICatalogService catalogService, IRoomService _roomService) : DynamicPageModel(catalogService)
{
    public IEnumerable<CatalogListItem> Cities { get; set; } = [];
    public async Task OnGetAsync()
    {
        Cities = await _roomService.GetCitiesAsync(PageData.Id);
    }
}
