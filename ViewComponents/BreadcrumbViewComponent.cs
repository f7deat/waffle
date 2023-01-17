using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class BreadcrumbViewComponent : ViewComponent
    {
        private readonly ILocalizationService _localizationService;
        private readonly ICatalogService _catalogService;
        public BreadcrumbViewComponent(ICatalogService catalogService, ILocalizationService localizationService)
        {
            _catalogService = catalogService;
            _localizationService = localizationService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid catalogId)
        {
            var breadcrumb = new List<Breadcrumb>
            {
                new Breadcrumb
                {
                    Url = "/",
                    Name = await _localizationService.GetAsync("home"),
                    Position = 1,
                    Icon = "fas fa-home"
                }
            };

            var catalog = await _catalogService.FindAsync(catalogId);
            if (catalog != null)
            {
                breadcrumb.Add(new Breadcrumb
                {
                    Url = GetMasterUrl(catalog.Type),
                    Name = await _localizationService.GetAsync(catalog.Type.ToString()),
                    Position = breadcrumb.Count + 1
                });

                if (catalog.ParentId != null)
                {
                    var parrent = await _catalogService.FindAsync(catalog.ParentId ?? Guid.Empty);
                    if (parrent != null)
                    {
                        breadcrumb.Add(new Breadcrumb
                        {
                            Url = GetUrl(parrent),
                            Name = parrent.Name,
                            Position = breadcrumb.Count + 1
                        });
                    }
                }
                breadcrumb.Add(new Breadcrumb
                {
                    Url = GetUrl(catalog),
                    Name = catalog.Name,
                    Position = breadcrumb.Count + 1
                });
            }
            return View(breadcrumb);
        }

        private static string GetUrl(Catalog catalog)
        {
            if (catalog.Type == CatalogType.Article)
            {
                return $"/article/{catalog.NormalizedName}";
            }
            return $"/page/{catalog.NormalizedName}";
        }

        private static string GetMasterUrl(CatalogType type)
        {
            if (CatalogType.Default == type)
            {
                return "/page";
            }
            return $"/{type.ToString().ToLower()}";
        }
    }
}
