using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Games
{
    public class RedirectModel : PageModel
    {
        private readonly IGameService _gameService;
        private readonly ICatalogService _catalogService;
        public RedirectModel(IGameService gameService, ICatalogService catalogService)
        {
            _gameService = gameService;
            _catalogService = catalogService;
        }

        public string NormalizedName = string.Empty;

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            var product = await _gameService.GetEpicGamesProductAsync(normalizedName);
            if (product != null)
            {
                var catalog = await _catalogService.GetByNameAsync(normalizedName);
                if (catalog is null)
                {
                    if (!string.IsNullOrEmpty(product.ProductName))
                    {
                        catalog = new Catalog
                        {
                            Active = true,
                            CreatedDate = DateTime.Now,
                            ModifiedDate = DateTime.Now,
                            Name = product.ProductName,
                            Description = product.Pages[0].Data.About.ShortDescription,
                            NormalizedName = normalizedName,
                            Type = CatalogType.Game,
                            ViewCount = 0,
                            Thumbnail = product.Pages[0].Data.About.Image.Src
                        };
                        await _catalogService.AddAsync(catalog);
                    }
                }
            }
            NormalizedName = normalizedName;
            return Page();
        }
    }
}
