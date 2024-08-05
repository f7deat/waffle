using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Articles;

public class IndexModel : EntryPageModel
{

    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;

    public ListResult<Catalog>? Articles;

    public IndexModel(ICatalogService catalogService) : base(catalogService)
    {
    }

    [BindProperty(SupportsGet = true)]
    public string? SearchTerm { get; set; }

    public async Task OnGetAsync()
    {
        Articles = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            PageSize = 12,
            Current = Current,
            Type = CatalogType.Article,
            Name = SearchTerm
        });
    }
}
