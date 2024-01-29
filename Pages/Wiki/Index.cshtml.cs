using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.Wiki
{
    public class IndexModel : EntryPageModel
    {
        public IndexModel(ICatalogService catalogService) : base(catalogService)
        {
        }

        public void OnGet()
        {
        }
    }
}
