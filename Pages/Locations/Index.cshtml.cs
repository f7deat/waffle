using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Core.Foundations;

namespace Waffle.Pages.Locations
{
    public class IndexModel : EntryPageModel
    {
        [BindProperty(SupportsGet = true)]
        public int Current { get; set; } = 1;

        public ListResult<Catalog>? Catalogs;

        public IndexModel(ICatalogService catalogService) : base(catalogService)
        {
        }

        public Pagination Pagination => new()
        {
            HasNextPage = Catalogs?.Total > Current * 12,
            HasPrevPage = Current > 1,
            NextPageUrl = $"/locations?current={Current + 1}",
            PrevPageUrl = $"/locations?current={Current - 1}",
        };

        public async Task OnGetAsync()
        {
            Catalogs = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                PageSize = 12,
                Current = Current,
                Type = CatalogType.Location
            });
        }
    }
}
