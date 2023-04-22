using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.Video
{
    public class IndexModel : EntryPageModel
    {
        public IndexModel(ICatalogService catalogService) : base(catalogService) { }

        public IActionResult OnGet()
        {
            return Page();
        }
    }
}
