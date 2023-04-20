using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;

namespace Waffle.Pages.Video
{
    public class DetailsModel : DynamicPageModel
    {
        public List<ComponentListItem> Components = new();

        public DetailsModel(ICatalogService catalogService) : base(catalogService)
        {
        }

        public async Task<IActionResult> OnGetAsync()
        {
            Components = await _catalogService.ListComponentAsync(PageData.Id);
            return Page();
        }
    }
}
