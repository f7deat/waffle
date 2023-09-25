﻿using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Models.Components;

namespace Waffle.ViewComponents;

public class BreadcrumbViewComponent : ViewComponent
{
    private readonly ILocalizationService _localizationService;
    private readonly ICatalogService _catalogService;
    public BreadcrumbViewComponent(ICatalogService catalogService, ILocalizationService localizationService)
    {
        _catalogService = catalogService;
        _localizationService = localizationService;
    }

    private Catalog PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(Catalog), out var values);
            return values as Catalog ?? new();
        }
    }

    private Catalog? Category
    {
        get
        {
            RouteData.Values.TryGetValue("Parent", out var values);
            return values as Catalog;
        }
    }

    public async Task<IViewComponentResult> InvokeAsync()
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

        if (Category != null)
        {
            breadcrumb.Add(new Breadcrumb
            {
                Url = $"/leaf/{Category.NormalizedName}",
                Name = Category.Name,
                Position = breadcrumb.Count + 1
            });
        }

        if (PageData.ParentId != null)
        {
            var parrent = await _catalogService.FindAsync(PageData.ParentId ?? Guid.Empty);
            if (parrent != null)
            {
                breadcrumb.Add(new Breadcrumb
                {
                    Url = parrent.GetUrl(),
                    Name = parrent.Name,
                    Position = breadcrumb.Count + 1
                });
            }
        }
        breadcrumb.Add(new Breadcrumb
        {
            Url = PageData.GetUrl(),
            Name = PageData.Name,
            Position = breadcrumb.Count + 1
        });
        return View(breadcrumb);
    }
}
