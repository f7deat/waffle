using Waffle.ExternalAPI.Interfaces;

namespace Waffle.ExternalAPI.Google
{
    public class GoogleService : IGoogleService
    {
        private readonly HttpClient _http;
        public GoogleService(HttpClient httpClient) => _http = httpClient;
        public async Task<Stream> GetDailyTrendingAsync() => await _http.GetStreamAsync("https://trends.google.com.vn/trends/trendingsearches/daily/rss?geo=VN");
    }
}
