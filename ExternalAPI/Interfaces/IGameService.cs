using Waffle.ExternalAPI.Game.Models;
using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Interfaces
{
    public interface IGameService
    {
        Task<string> LoL_GetVersionAsync();
        Task<List<string>> LOL_GetLanguagesAsync();
        Task<IDictionary<string, LoL_Champion>> GetChampionsAsync(string version, string lang);
        Task<List<EpicGamesElement>> GetEpicGamesFreeGamesPromotionsAsync();
    }
}
