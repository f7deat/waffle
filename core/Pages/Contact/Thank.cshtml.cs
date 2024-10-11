using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.Contact;

public class ThankModel : EntryPageModel
{
    public ThankModel(ICatalogService catalogService) : base(catalogService)
    {
    }

    public void OnGet()
    {
    }
}
