﻿using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Extensions;
using Waffle.Models.Settings;
using Waffle.Core.Options;
using Microsoft.Extensions.Options;
using Waffle.Core.Foundations;
using Waffle.Data;
using Waffle.Models.Components;
using Microsoft.EntityFrameworkCore;

namespace Waffle.ViewComponents;

public class HeaderViewComponent(ISettingService _settingService, IOptions<SettingOptions> options, ApplicationDbContext _context, ILocalizationService _localizationService) : ViewComponent
{
    private readonly SettingOptions Options = options.Value;

    protected PageData PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(PageData), out var values);
            return values as PageData ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var header = await _settingService.GetAsync<Header>(nameof(Header));
        header ??= new Header();
        header.IsAuthenticated = User.Identity?.IsAuthenticated ?? false;
        header.UserId = UserClaimsPrincipal.GetId();
        header.PageData = PageData;
        header.SearchPlaceHolder = await _localizationService.GetAsync(nameof(header.SearchPlaceHolder));

        var query = from a in _context.Menus
                    where a.Locale == PageData.Locale
                    select a;
        query = query.OrderBy(x => x.SortOrder);
        var menus = await query.ToListAsync();

        var parents = menus.Where(x => x.ParentId == null);
        var results = new List<NavItem>();

        foreach (var parent in parents)
        {
            var navItem = new NavItem
            {
                Name = parent.Name,
                Id = parent.Id,
                Href = parent.Url ?? "#",
                Icon = parent.Icon
            };
            if (menus.Any(x => x.ParentId == parent.Id))
            {
                navItem.Children = menus.Where(x => x.ParentId == parent.Id).Select(x => new NavItem
                {
                    Id = x.Id,
                    Name = x.Name,
                    Href = x.Url ?? "#"
                });
            }
            results.Add(navItem);
        }

        header.NavItems = results;

        return View(Options.Theme, header);
    }
}
