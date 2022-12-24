using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces.IServices;
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

        public async Task OnGetAsync(string normalizedName)
        {
            Catalog = await _catalogService.GetByNameAsync(normalizedName);
            BlockEditors = await GetBlockEditorsAsync(Catalog.Id);
        }

        private async Task<IEnumerable<Guid>> GetBlockEditorsAsync(Guid id)
        {
            return await _context.WorkContents.Where(x => x.Id == id).Select(x => x.Id).ToListAsync();
        }
    }
}
