using System.Text.Json;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Facebook
{
    public class FacebookService : IFacebookService
    {
        private readonly HttpClient _http;
        public FacebookService(HttpClient http)
        {
            _http = http;
        }
        public async Task<List<Album>?> GetAlbumsAsync(string pageId, string access_token)
        {
            try
            {
                _http.DefaultRequestHeaders.Add("Authorization", $"Bearer {access_token}");
                var response = await _http.GetStreamAsync($"{pageId}/albums?fields=name,type,picture");
                var data = await JsonSerializer.DeserializeAsync<FacebookListResult<Album>>(response);
                return data?.Data?.Where(x => (x.Type == "normal" || x.Type == "wall") && x.Picture?.Data?.IsSilhouette == false).ToList();
            }
            catch (Exception)
            {
                return default;
            }
        }

        public async Task<LongLivedUserAccessToken?> GetLongLivedUserAccessTokenAsync(string appId, string appSercet, string shortLiveToken)
        {
            try
            {
                var response = await _http.GetStreamAsync($"/oauth/access_token?grant_type=fb_exchange_token&client_id={appId}&client_secret={appSercet}&fb_exchange_token={shortLiveToken}");
                return await JsonSerializer.DeserializeAsync<LongLivedUserAccessToken>(response);
            }
            catch (Exception)
            {
                return default;
            }
        }

        public async Task<LongLivedPageAccessToken?> GetLongLivedPageAccessTokenAsync(string appId, string longLivedUserAccessToken)
        {
            try
            {
                var response = await _http.GetStreamAsync($"/{appId}/accounts?access_token={longLivedUserAccessToken}");
                return await JsonSerializer.DeserializeAsync<LongLivedPageAccessToken>(response);
            }
            catch (Exception)
            {
                return default;
            }
        }
    }
}
