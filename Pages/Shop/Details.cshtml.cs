using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.Pages.Shop
{
    public class DetailsModel : PageModel
    {
        private readonly ICatalogService _productService;
        private readonly ApplicationDbContext _context;
        private readonly IComponentService _componentService;
        private readonly IWorkService _workService;

        public DetailsModel(ICatalogService productService, ApplicationDbContext context, IComponentService componentService, IWorkService workService)
        {
            _context = context;
            _productService = productService;
            _componentService = componentService;
            _workService = workService;
            Catalog = new Catalog();
        }

        public Catalog Catalog;
        public IEnumerable<Catalog> Tags = new List<Catalog>();
        public IEnumerable<Link?> ReferalLinks = new List<Link>();

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            var catalog = await _productService.GetByNameAsync(normalizedName);
            if (catalog is null)
            {
                return NotFound();
            }
            Catalog = catalog;
            Tags = await _productService.ListTagByIdAsync(catalog.Id);
            ReferalLinks = await GetLinksAsync() ?? new List<Link>();
            return Page();
        }

        public async Task<IEnumerable<Link?>> GetLinksAsync()
        {
            var links = new List<Link>();
            var linkComponent = await _componentService.EnsureComponentAsync(nameof(Link));
            var works = from a in _context.WorkItems
                        join b in _context.WorkContents on a.WorkId equals b.Id
                        where a.CatalogId == Catalog.Id && b.Active && b.ComponentId == linkComponent.Id
                        orderby a.SortOrder ascending
                        select b.Arguments;
            return _workService.ListAsync<Link>(await works.ToListAsync());
        }
    }
}
