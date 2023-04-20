using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.Pages.Shop
{
    public class DetailsModel : DynamicPageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly IComponentService _componentService;
        private readonly IWorkService _workService;

        public DetailsModel(ICatalogService catalogService, ApplicationDbContext context, IComponentService componentService, IWorkService workService) : base(catalogService)
        {
            _context = context;
            _componentService = componentService;
            _workService = workService;
        }

        public IEnumerable<Catalog> Tags = new List<Catalog>();
        public IEnumerable<Link?> ReferalLinks = new List<Link>();

        public async Task<IActionResult> OnGetAsync()
        {
            Tags = await _catalogService.ListTagByIdAsync(PageData.Id);
            ReferalLinks = await GetLinksAsync() ?? new List<Link>();
            return Page();
        }

        public async Task<IEnumerable<Link?>> GetLinksAsync()
        {
            var links = new List<Link>();
            var linkComponent = await _componentService.EnsureComponentAsync(nameof(Link));
            var works = from a in _context.WorkItems
                        join b in _context.WorkContents on a.WorkId equals b.Id
                        where a.CatalogId == PageData.Id && b.Active && b.ComponentId == linkComponent.Id
                        orderby a.SortOrder ascending
                        select b.Arguments;
            return _workService.ListAsync<Link>(await works.ToListAsync());
        }
    }
}
