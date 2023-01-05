using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class BreadcrumbViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public BreadcrumbViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid catalogId)
        {
            var breadcrumb = new List<Breadcrumb>
            {
                new Breadcrumb
                {
                    Url = "/",
                    Name = "Home",
                    Position = 1,
                    Icon = "fas fa-home"
                }
            };

            var catalog = await _context.Catalogs.FindAsync(catalogId);
            if (catalog != null)
            {
                breadcrumb.Add(new Breadcrumb
                {
                    Url = $"/{catalog.Type.ToString().ToLower()}",
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

        private static string GetDisplayName(Catalog catalog)
        {
            if (catalog.Type == CatalogType.Article)
            {
                return "Articles";
            }
            return "Pages";
        }
    }
}
