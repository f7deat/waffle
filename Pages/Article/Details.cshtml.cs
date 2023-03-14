using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
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
        public DetailsModel(ICatalogService catalogService, ApplicationDbContext context)
        {
            _catalogService = catalogService;
            _context = context;
        }

        public Catalog? Catalog;
        public List<Guid> BlockEditors = new();
        public List<WorkContent> Tags = new();

        public async Task OnGetAsync(string normalizedName)
        {
            Catalog = await _catalogService.GetByNameAsync(normalizedName);
            if (Catalog != null)
            {
                ViewData["Title"] = Catalog.Name;
                ViewData["Description"] = Catalog.Description;
                BlockEditors = await GetBlockEditorsAsync(Catalog.Id);
                Tags = await GetTagsAsync(Catalog.Id);
            }
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

        private async Task<List<WorkContent>> GetTagsAsync(Guid catalogId)
        {
            var tags = from a in _context.WorkItems
                         join b in _context.WorkContents on a.WorkId equals b.Id
                         join c in _context.Components on b.ComponentId equals c.Id
                         where a.CatalogId == catalogId && c.NormalizedName.Equals(nameof(Tag))
                         select b;
            return await tags.ToListAsync();
        }
    }
}
