using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Products.List;

public class IndexModel : EntryPageModel
{
    public IndexModel(ICatalogService catalogService) : base(catalogService)
    {
    }

    public IEnumerable<ComponentListItem> Components = new List<ComponentListItem>();

    public async Task OnGetAsync()
    {
        Components = await _catalogService.ListComponentAsync(PageData.Id);
    }
}
