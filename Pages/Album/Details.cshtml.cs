using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Album
{
    public class DetailsModel : DynamicPageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DetailsModel(ICatalogService catalogService, ApplicationDbContext context, UserManager<ApplicationUser> userManager) : base(catalogService)
        {
            _context = context;
            _userManager = userManager;
        }

        public List<WorkListItem> Works = new();
        public IEnumerable<Catalog> Tags = new List<Catalog>();

        public string Email = string.Empty;
        public bool IsAuthenticated = false;

        public async Task<IActionResult> OnGetAsync()
        {
            Works = await GetBlockEditorsAsync(PageData.Id);
            Tags = await _catalogService.ListTagByIdAsync(PageData.Id);

            IsAuthenticated = User.Identity?.IsAuthenticated ?? false;
            if (IsAuthenticated)
            {
                var user = await _userManager.GetUserAsync(User);
                Email = user.Email;
            }

            return Page();
        }

        private async Task<List<WorkListItem>> GetBlockEditorsAsync(Guid catalogId)
        {
            var query = from a in _context.WorkItems
                        join b in _context.WorkContents on a.WorkId equals b.Id
                        join c in _context.Components on b.ComponentId equals c.Id
                        where a.CatalogId == catalogId && b.Active
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
