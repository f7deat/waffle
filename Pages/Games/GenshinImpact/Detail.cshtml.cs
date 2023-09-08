using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Game.Models;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Games.GenshinImpact;

public class DetailModel : PageModel
{
    private readonly IGameService _gameService;
    public DetailModel(IGameService gameService)
    {
        _gameService = gameService;
    }

    public GIContent Data { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(int id)
    {
        var content = await _gameService.GetGIContentDetailAsync(id);
        if (content is null)
        {
            return NotFound();
        }
        ViewData["Title"] = content.Title;
        ViewData["Description"] = content.Intro;
        Data = content;
        return Page();
    }
}
