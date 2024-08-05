using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Game.Models;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;

namespace Waffle.Pages.Games.GenshinImpact;

public class IndexModel : PageModel
{
    private readonly IGameService _gameService;
    public IndexModel(IGameService gameService)
    {
        _gameService = gameService;
    }

    [BindProperty(SupportsGet = true)]
    public BasicFilterOptions FilterOptions { get; set; } = new();

    public GIContentList ContentList { get; set; } = new();

    public async Task OnGetAsync()
    {
        ContentList = await _gameService.GetGIContentListAsync(FilterOptions);
    }
}
