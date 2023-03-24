using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models.Components;

namespace Waffle.Pages.Game.LeagueOfLegends
{
    public class IndexModel : PageModel
    {
        private readonly IGameService _gameService;
        public IndexModel(IGameService gameService)
        {
            _gameService = gameService;
        }

        public string Version = string.Empty;
        public List<string> Languages = new();
        public ListGroup Champions = new();

        public async Task OnGetAsync()
        {
            Version = await _gameService.LoL_GetVersionAsync();
            Languages = await _gameService.LOL_GetLanguagesAsync();
            Champions = new ListGroup
            {
                Name = $"Champions",
                Items = GetChampions(Languages)
            };
        }

        public List<ListGroupItem> GetChampions(List<string> languages)
        {
            var returnValue = new List<ListGroupItem>();
            foreach (var language in languages)
            {
                returnValue.Add(new ListGroupItem
                {
                    Link = new Link
                    {
                        Href = $"/game/league-of-legends/champions?lang={language}&version={Version}",
                        Name = $"[{language}] Champion"
                    }
                });
            }
            return returnValue;
        }
    }
}
