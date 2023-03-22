using System.Text.Json;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.ExternalAPI.Wiki
{
    public class WikiService : IWikiService
    {
        private readonly HttpClient _http;
        public WikiService(HttpClient http)
        {
            _http = http;
        }

        public async Task<Parse> FandomAsync(string page, string name, string lang)
        {
            try
            {
                var url = $"https://{name}.fandom.com/{lang}/api.php?format=json&formatversion=2";
                var response = await _http.GetStreamAsync($"{url}&action=query&prop=text&page={page}");
                var data = await JsonSerializer.DeserializeAsync<Action>(response);
                return data?.Parse ?? new Parse();
            }
            catch (Exception)
            {
                return new Parse();
            }
        }

        public async Task<Parse?> ParseAsync(string page, string lang)
        {
            try
            {
                var url = $"https://{lang}.wikipedia.org/w/api.php?format=json&formatversion=2";
                var response = await _http.GetStreamAsync($"{url}&action=parse&prop=text&page={page}");
                var data = await JsonSerializer.DeserializeAsync<Action>(response);
                return data?.Parse;
            }
            catch (Exception)
            {
                return default;
            }
        }
    }
}
