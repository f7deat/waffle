using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.Career;

public class ThankModel(ICatalogService catalogService) : EntryPageModel(catalogService)
{
    public void OnGet()
    {
    }
}
