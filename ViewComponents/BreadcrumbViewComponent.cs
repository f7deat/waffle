using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class BreadcrumbViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        private readonly ILocalizationService _localizationService;
        public BreadcrumbViewComponent(ApplicationDbContext context, ILocalizationService localizationService)
        {
            _context = context;
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

            var catalog = await _context.Catalogs.FindAsync(catalogId);
            if (catalog != null)
            {
                breadcrumb.Add(new Breadcrumb
                {
                    Url = GetMasterUrl(catalog.Type),
                    Name = GetDisplayName(catalog),
                    Position = breadcrumb.Count + 1
                });

                if (catalog.ParentId != null)
                {
                    var parrent = await _context.Catalogs.FindAsync(catalog.ParentId);
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

        private async Task<string> GetDisplayName(Catalog catalog)
        {
            if (catalog.Type == CatalogType.Article)
            {
                return await _localizationService.GetAsync(CatalogType.Article.ToString());
            }
            return "Pages";
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
