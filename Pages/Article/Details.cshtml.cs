using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.Pages.Article
{
    public class DetailsModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public DetailsModel(ICatalogService catalogService, ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _catalogService = catalogService;
            _context = context;
            _userManager = userManager;
        }

        public Catalog Catalog = new();
        public List<Guid> BlockEditors = new();
        public IEnumerable<Catalog> Tags = new List<Catalog>();

        public string Email = string.Empty;
        public bool IsAuthenticated = false;

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            Catalog = await _catalogService.GetByNameAsync(normalizedName) ?? new Catalog();
            if (string.IsNullOrEmpty(Catalog.NormalizedName))
            {
                return NotFound();
            }

            ViewData["Title"] = Catalog.Name;
            ViewData["Description"] = Catalog.Description;
            ViewData["Image"] = Catalog.Thumbnail;

            BlockEditors = await GetBlockEditorsAsync(Catalog.Id);
            Tags = await _catalogService.ListTagByIdAsync(Catalog.Id);

            IsAuthenticated = User.Identity?.IsAuthenticated ?? false;
            if (IsAuthenticated)
            {
                var user = await _userManager.GetUserAsync(User);
                Email = user.Email;
            }

            return Page();
        }

        private async Task<List<Guid>> GetBlockEditorsAsync(Guid catalogId)
        {
            var query = from a in _context.WorkItems
                        join b in _context.WorkContents on a.WorkId equals b.Id
                        join c in _context.Components on b.ComponentId equals c.Id
                        where a.CatalogId == catalogId && c.NormalizedName.Equals(nameof(BlockEditor)) && b.Active
                        select b.Id;
            return await query.ToListAsync();
        }
    }
}
