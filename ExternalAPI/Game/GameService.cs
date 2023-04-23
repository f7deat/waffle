using System.Text.Json;
using Waffle.ExternalAPI.Game.Models;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Game
{
    public class GameService : IGameService
    {
        private readonly HttpClient _http;
        public GameService(HttpClient httpClient)
        {

            _http = httpClient;
        }

        public async Task<IDictionary<string, LoL_Champion>> GetChampionsAsync(string version, string lang)
        {
            var response = await _http.GetStreamAsync($"http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/champion.json");
            var data = await JsonSerializer.DeserializeAsync<LoL_Data<LoL_Champion>>(response) ?? new LoL_Data<LoL_Champion>();
            return data?.Data ?? new Dictionary<string, LoL_Champion>();
        }

        public async Task<List<EpicGamesElement>> GetEpicGamesFreeGamesPromotionsAsync()
        {
            var url = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=VN&allowCountries=VN";
            var response = await _http.GetStreamAsync(url);
            var data = await JsonSerializer.DeserializeAsync<EpicGamesFreeGamesPromotions>(response);
            return data?.Data.Catalog.SearchStore.Elements ?? new();
        }

        public async Task<EpicGamesProduct?> GetEpicGamesProductAsync(string normalizedName)
        {
            try
            {
                var url = $"https://store-content-ipv4.ak.epicgames.com/api/en-US/content/products/{normalizedName}";
                var response = await _http.GetStreamAsync(url);
                return await JsonSerializer.DeserializeAsync<EpicGamesProduct>(response);
            }
            catch (Exception)
            {
                return default;
            }
        }

        public async Task<List<string>> LOL_GetLanguagesAsync()
        {
            var response = await _http.GetStreamAsync("https://ddragon.leagueoflegends.com/cdn/languages.json");
            return await JsonSerializer.DeserializeAsync<List<string>>(response) ?? new List<string>();
        }

        public async Task<string> LoL_GetVersionAsync()
        {
            var response = await _http.GetStreamAsync("https://ddragon.leagueoflegends.com/api/versions.json");
            var data = await JsonSerializer.DeserializeAsync<List<string>>(response);
            return data?.First() ?? "13.6.1";
        }
    }
}
