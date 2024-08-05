using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Game.Models;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Game.LeagueOfLegends
{
    public class ChampionsModel : PageModel
    {
        private readonly IGameService _gameService;
        public ChampionsModel(IGameService gameService)
        {
            _gameService = gameService;
        }

        public IDictionary<string, LoL_Champion> Champions = new Dictionary<string, LoL_Champion>();

        public async Task OnGetAsync(string version, string lang)
        {
            Champions = await _gameService.GetChampionsAsync(version, lang);
        }
    }
}
