using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Article
{
    public class DetailsModel : DynamicPageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IShopeeService _shopeeService;

        public DetailsModel(ICatalogService catalogService, ApplicationDbContext context, UserManager<ApplicationUser> userManager, IShopeeService shopeeService) : base(catalogService)
        {
            _context = context;
            _userManager = userManager;
            _shopeeService = shopeeService;
        }

        public List<WorkListItem> Works = new();
        public List<Catalog> Tags = new();
        public bool HasTag => Tags.Any();
        public Feed ProductFeed = new();
        public bool HasProduct = false;
        public LandingPageLinkList ShopeeProducts = new();

        public string Email = string.Empty;
        public bool IsAuthenticated = false;

        public async Task<IActionResult> OnGetAsync()
        {
            Works = await GetBlockEditorsAsync();
            Tags = await _catalogService.ListTagByIdAsync(PageData.Id);

            IsAuthenticated = User.Identity?.IsAuthenticated ?? false;
            if (IsAuthenticated)
            {
                var user = await _userManager.GetUserAsync(User);
                Email = user.Email;
            }

            if (Tags.Any())
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
                    Articles = product.Data?.ToList() ?? new(),
                    ItemPerRow = "grid-cols-2"
                };

                ShopeeProducts = await _shopeeService.GetLinkListsAsync(Tags.Last().Name);
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
}
