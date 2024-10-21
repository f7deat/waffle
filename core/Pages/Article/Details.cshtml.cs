using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;

namespace Waffle.Pages.Article;

public class DetailsModel : DynamicPageModel
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IShopeeService _shopeeService;
    private readonly SettingOptions Options;

    public DetailsModel(ICatalogService catalogService, ApplicationDbContext context, UserManager<ApplicationUser> userManager, IShopeeService shopeeService, IOptions<SettingOptions> options) : base(catalogService)
    {
        _context = context;
        _userManager = userManager;
        _shopeeService = shopeeService;
        Options = options.Value;
    }

    public List<WorkListItem> Works = new();
    [UIHint(UIHint.Tags)]
    public List<Catalog> Tags = new();
    public bool HasTag => Tags.Any();
    public LandingPageLinkList ShopeeProducts = new();

    public bool IsAuthenticated = false;

    public async Task<IActionResult> OnGetAsync()
    {
        Works = await GetBlockEditorsAsync();
        Tags = await _catalogService.ListTagByIdAsync(PageData.Id);

        IsAuthenticated = User.Identity?.IsAuthenticated ?? false;

        if (Tags.Any() && Options.Theme == "Default")
        {
            ShopeeProducts = await _shopeeService.GetLinkListsAsync(Tags.Last().Name, 1, 4);
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
                    select new WorkListItem { 
                        Id = b.Id,
                        Name = b.Name,
                        NormalizedName = c.NormalizedName
                    };
        return await query.ToListAsync();
    }
}
