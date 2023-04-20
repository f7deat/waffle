using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Google.Models;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Blogspot
{
    public class DetailsModel : DynamicPageModel
    {
        private readonly IGoogleService _googleService;
        private readonly IWorkService _workService;
        public DetailsModel(IGoogleService googleService, ICatalogService catalogService, IWorkService workService) : base(catalogService)
        {
            _googleService = googleService;
            _workService = workService;
        }

        public BloggerItem? Item;

        public async Task<IActionResult> OnGetAsync(string year, string month, string path)
        {
            var work = await _catalogService.FirstWorkAsync(PageData.Id);
            if (work is null)
            {
                return NotFound();
            }
            var blogger = await _workService.GetAsync<Blogger>(work.Id);
            if (blogger is null)
            {
                return NotFound();
            }
            Item = await _googleService.BloggerGetByPathAsync(blogger.BlogId, $"/{year}/{month}/{path}", blogger.ApiKey);
            if (Item != null)
            {
                ViewData["Title"] = Item.Title;
            }
            return Page();
        }
    }
}
