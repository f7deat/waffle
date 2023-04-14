using System.Text.Json;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Services
{
    public class WordPressService : IWordPressService
    {
        private readonly HttpClient _httpClient;
        public WordPressService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<WordPressPost?> GetPostAsync(string domain, int id)
        {
            try
            {
                var url = $"https://{domain}/wp-json/wp/v2/posts/{id}";
                var response = await _httpClient.GetStreamAsync(url);
                return await JsonSerializer.DeserializeAsync<WordPressPost>(response);
            }
            catch (Exception)
            {
                return default;
            }
        }
    }
}
