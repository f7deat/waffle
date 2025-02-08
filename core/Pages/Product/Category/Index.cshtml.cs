using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.Product.Category;

public class IndexModel(ICatalogService catalogService) : EntryPageModel(catalogService)
{
    public void OnGet()
    {
    }
}
