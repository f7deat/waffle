using System.Text.Json;
using Waffle.Core.Helpers;
using Waffle.Core.Services.AppSettings;
using Waffle.ExternalAPI.Google.Models;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.ExternalAPI.Google
{
    public class GoogleService : IGoogleService
    {
        private readonly HttpClient _http;
        private readonly IAppSettingService _appService;
        public GoogleService(HttpClient httpClient, IAppSettingService appSettingService)
        {
            _http = httpClient;
            _appService = appSettingService;
        }

        public async Task<Trend?> GetDailyTrendingAsync()
        {
            var response = await _http.GetStreamAsync("https://trends.google.com.vn/trends/trendingsearches/daily/rss?geo=VN");
            return XmlHelper.Deserialize<Trend>(response);
        }

        public async Task<BloggerListResult<BloggerItem>?> BloggerSearchAsync(string blogId, string apiKey, string searchTerm)
        {
            var url = $"https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/search?q={searchTerm}&key={apiKey}";
            return await JsonSerializer.DeserializeAsync<BloggerListResult<BloggerItem>>(await _http.GetStreamAsync(url));
        }

        public async Task<BloggerListResult<BloggerItem>?> BloggerPostsAsync(string? blogId, string? apiKey, int maxResults, string pageToken, string labels)
        {
            var url = $"https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts?key={apiKey}&maxResults={maxResults}";
            if (!string.IsNullOrEmpty(pageToken))
            {
                url += $"&pageToken={pageToken}";
            }
            if (!string.IsNullOrEmpty(labels))
            {
                url += $"&labels={labels}";
            }
            return await JsonSerializer.DeserializeAsync<BloggerListResult<BloggerItem>>(await _http.GetStreamAsync(url));
        }

        public async Task<BloggerItem?> BloggerGetAsync(string? blogId, string postId, string? apiKey)
        {
            var response = await _http.GetStreamAsync($"https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}?key={apiKey}");
            return await JsonSerializer.DeserializeAsync<BloggerItem?>(response);
        }

        public async Task<BloggerItem?> BloggerGetByPathAsync(string? blogId, string path, string? apiKey)
        {
            var response = await _http.GetStreamAsync($"https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/bypath?path={path}&key={apiKey}");
            return await JsonSerializer.DeserializeAsync<BloggerItem?>(response);
        }
    }
}
