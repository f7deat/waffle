using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Article;

public class IndexModel(ICatalogService catalogService, ILocalizationService _localizationService) : EntryPageModel(catalogService)
{
    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;

    public ListResult<CatalogListItem>? Articles;

    [BindProperty(SupportsGet = true)]
    public string? SearchTerm { get; set; }
    public string? SearchPlaceHolder {  get; set; }

    public async Task OnGetAsync()
    {
        Articles = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            PageSize = 12,
            Current = Current,
            Type = CatalogType.Article,
            Name = SearchTerm,
            Locale = PageData.Locale
        });
        SearchPlaceHolder = await _localizationService.GetAsync(nameof(SearchPlaceHolder));
    }
}
