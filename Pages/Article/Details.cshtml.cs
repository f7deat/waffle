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
        public IEnumerable<Guid>? BlockEditors;
        public IAsyncEnumerable<Tag?>? Tags;

        public async Task OnGetAsync(string normalizedName)
        {
            Catalog = await _catalogService.GetByNameAsync(normalizedName);
            if (Catalog != null)
            {
                Catalog.ViewCount++;
                await _context.SaveChangesAsync();
                BlockEditors = await GetBlockEditorsAsync(Catalog.Id);
                Tags = GetTagsAsync(Catalog.Id);
            }
        }

        private async Task<IEnumerable<Guid>> GetBlockEditorsAsync(Guid catalogId)
        {
            return await _context.WorkItems.Where(x => x.CatalogId == catalogId).Select(x => x.WorkContentId).ToListAsync();
        }

        private async IAsyncEnumerable<Tag?>? GetTagsAsync(Guid catalogId)
        {
            var tags = await (from a in _context.WorkItems
                         join b in _context.WorkContents on a.WorkContentId equals b.Id
                         join c in _context.Components on b.ComponentId equals c.Id
                         where a.CatalogId == catalogId && c.NormalizedName.Equals(nameof(Tag)) && b.Active
                         select b.Arguments).ToListAsync();
            foreach (var tag in tags)
            {
                if (string.IsNullOrEmpty(tag))
                {
                    continue;
                }
                yield return JsonSerializer.Deserialize<Tag>(tag);
            }
        }
    }
}
