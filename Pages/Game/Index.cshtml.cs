using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;

namespace Waffle.Pages.Game
{
    public class IndexModel : EntryPageModel
    {
        private readonly IGameService _gameService;
        public IndexModel(ICatalogService catalogService, IGameService gameService) : base(catalogService)
        {
            _gameService = gameService;
        }

        public IEnumerable<ComponentListItem> Components = new List<ComponentListItem>();
        public List<EpicGamesElement> EpicGamesFree = new();

        public async Task OnGetAsync()
        {
            Components = await _catalogService.ListComponentAsync(PageData.Id);
        }
    }
}
