using System.Text.Json;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Googles.Models;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models.GoogleAggregate;

namespace Waffle.ExternalAPI.Services;

public class GoogleService : IGoogleService
{
    private readonly HttpClient _http;
    private readonly ILogger<GoogleService> _logger;
    private readonly ILocalizationService _localizationService;

    public GoogleService(HttpClient httpClient, ILogger<GoogleService> logger, ILocalizationService localizationService)
    {
        _http = httpClient;
        _logger = logger;
        _localizationService = localizationService;
    }

    public async Task<Trend?> GetDailyTrendingAsync()
    {
        try
        {
            var locale = _localizationService.CurrentLocale();
            var geo = locale.Split('-').Last();
            var response = await _http.GetStreamAsync($"https://trends.google.com.vn/trending/rss?geo={geo}");
            return XmlHelper.Deserialize<Trend>(response);
        }
        catch (Exception ex)
        {
            _logger.LogError("{Message}", ex.Message);
            return default;
        }
    }

    public async Task<BloggerListResult<BloggerItem>?> BloggerSearchAsync(string blogId, string apiKey, string searchTerm)
    {
        var url = $"https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/search?q={searchTerm}&key={apiKey}";
        return await JsonSerializer.DeserializeAsync<BloggerListResult<BloggerItem>>(await _http.GetStreamAsync(url));
    }

    public async Task<BloggerListResult<BloggerItem>?> BloggerPostsAsync(string? blogId, string? apiKey, int maxResults, string pageToken, string? labels)
    {
        var url = $"https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts?fetchImages=true&fetchBodies=false&key={apiKey}&maxResults={maxResults}";
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

    public async Task<BloggerItem?> BloggerGetAsync(string? blogId, string? postId, string? apiKey)
    {
        try
        {
            var response = await _http.GetStreamAsync($"https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}?key={apiKey}");
            return await JsonSerializer.DeserializeAsync<BloggerItem?>(response);
        }
        catch (Exception ex)
        {
            _logger.LogError("{Message}", ex.Message);
            return default;
        }
    }

    public async Task<BloggerItem?> BloggerGetByPathAsync(string? blogId, string path, string? apiKey)
    {
        var response = await _http.GetStreamAsync($"https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/bypath?path={path}&key={apiKey}");
        return await JsonSerializer.DeserializeAsync<BloggerItem?>(response);
    }
}
