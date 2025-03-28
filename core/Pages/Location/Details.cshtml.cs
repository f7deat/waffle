﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;
using Waffle.Models;
using Microsoft.EntityFrameworkCore;

namespace Waffle.Pages.Location;

public class DetailsModel : DynamicPageModel
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public DetailsModel(ICatalogService catalogService, ApplicationDbContext context, UserManager<ApplicationUser> userManager) : base(catalogService)
    {
        _context = context;
        _userManager = userManager;
    }

    public List<WorkListItem> Works = [];
    public List<Catalog> Tags = [];
    public bool HasTag => Tags.Count != 0;
    public Feed ProductFeed = new();
    public bool HasProduct = false;

    public string? Email;
    public bool IsAuthenticated = false;

    public async Task<IActionResult> OnGetAsync()
    {
        Works = await GetBlockEditorsAsync();
        Tags = await _catalogService.ListTagByIdAsync(PageData.Id);

        IsAuthenticated = User.Identity?.IsAuthenticated ?? false;
        if (IsAuthenticated)
        {
            var user = await _userManager.GetUserAsync(User);
            Email = user?.Email;
        }

        if (Tags.Count != 0)
        {
            var tagIds = Tags.Select(x => x.Id);
            var product = await _catalogService.ListByTagsAsync(tagIds, new CatalogFilterOptions
            {
                Active = true,
                PageSize = 4,
                Type = CatalogType.Product
            });
            HasProduct = product.HasData;
            ProductFeed = new Feed
            {
                Name = "Sản phẩm liên quan",
                Catalogs = product.Data?.ToList() ?? []
            };
        }

        return Page();
    }

    private async Task<List<WorkListItem>> GetBlockEditorsAsync()
    {
        var query = from a in _context.WorkItems
                    join b in _context.WorkContents on a.WorkId equals b.Id
                    join c in _context.Components on b.ComponentId equals c.Id
                    where a.CatalogId == PageData.Id && b.Active
                    orderby a.SortOrder
                    select new WorkListItem
                    {
                        Id = b.Id,
                        Name = b.Name,
                        NormalizedName = c.NormalizedName
                    };
        return await query.ToListAsync();
    }
}
