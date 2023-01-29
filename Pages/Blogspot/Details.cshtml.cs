using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Blogspot
{
    public class DetailsModel : PageModel
    {
        private readonly IGoogleService _googleService;
        private readonly ICatalogService _catalogService;
        private readonly IWorkService _workService;
        public DetailsModel(IGoogleService googleService, ICatalogService catalogService, IWorkService workService)
        {
            _googleService = googleService;
            _catalogService = catalogService;
            _workService = workService;
        }

        public BloggerItem? Item;
        public Catalog? Catalog;

        public async Task<IActionResult> OnGetAsync(string normalizedName, string year, string month, string path)
        {
            Catalog = await _catalogService.GetByNameAsync(normalizedName);
            if (Catalog == null)
            {
                return NotFound("Catalog not found");
            }
            var work = await _catalogService.FirstWorkAsync(Catalog.Id);
            if (work is null)
            {
                return NotFound("Work not found");
            }
            var blogger = await _workService.GetAsync<Blogger>(work.Id);
            if (blogger is null)
            {
                return NotFound("Blogger not found");
            }
            Item = await _googleService.BloggerGetByPathAsync(blogger.BlogId, $"/{year}/{month}/{path}", blogger.ApiKey);
            if (Item != null)
            {
                ViewData["Title"] = Item.Title;
                ViewData["Description"] = Item.Content[..250];
            }
            return Page();
        }
    }
}