﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.ViewComponents;

public class BreadcrumbViewComponent : ViewComponent
{
    private readonly ILocalizationService _localizationService;
    private readonly ICatalogService _catalogService;
    private readonly SettingOptions Options;
    public BreadcrumbViewComponent(ICatalogService catalogService, ILocalizationService localizationService, IOptions<SettingOptions> options)
    {
        _catalogService = catalogService;
        _localizationService = localizationService;
        Options = options.Value;
    }

    private PageData PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(PageData), out var values);
            return values as PageData ?? new();
        }
    }

    private PageData? CategoryData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(CategoryData), out var values);
            return values as PageData;
        }
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var breadcrumb = new List<Breadcrumb>
        {
            new() {
                Url = "/",
                Name = await _localizationService.GetAsync("home"),
                Position = 1,
                Icon = "fas fa-home"
            }
        };

        if (PageData.Type != CatalogType.Entry && PageData.Type != CatalogType.Leaf)
        {
            breadcrumb.Add(new Breadcrumb
            {
                Url = $"/{PageData.Type.ToString().ToLower()}",
                Name = await _localizationService.GetAsync(PageData.Type.ToString()),
                Position = breadcrumb.Count + 1
            });
        }

        if (PageData.ParentId != null)
        {
            var parent = await _catalogService.FindAsync(PageData.ParentId.Value);
            if (parent != null)
            {
                breadcrumb.Add(new Breadcrumb
                {
                    Url = parent.Url ?? $"/{parent.Type}/{parent.NormalizedName}".ToLower(),
                    Name = parent.Name,
                    Position = breadcrumb.Count + 1
                });
            }
        }

        breadcrumb.Add(new Breadcrumb
        {
            Url = PageData.Url,
            Name = PageData.Name,
            Position = breadcrumb.Count + 1
        });
        return View(Options.Theme, breadcrumb);
    }
}
