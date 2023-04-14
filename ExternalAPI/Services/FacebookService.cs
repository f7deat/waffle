using System.Text.Json;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Services
{
    public class FacebookService : IFacebookService
    {
        private readonly HttpClient _http;
        public FacebookService(HttpClient http)
        {
            http.BaseAddress = new Uri("https://graph.facebook.com");
            _http = http;
        }

        public async Task<List<Album>> GetAlbumsAsync(string pageId, string access_token)
        {
            try
            {
                var response = await _http.GetStreamAsync($"{pageId}/albums?fields=name,type,picture&access_token={access_token}");
                var data = await JsonSerializer.DeserializeAsync<FacebookListResult<Album>>(response);
                return data?.Data?.Where(x => (x.Type == "normal" || x.Type == "wall") && x.Picture?.Data?.IsSilhouette == false).ToList() ?? new List<Album>();
            }
            catch (Exception)
            {
                return new List<Album>();
            }
        }

        public async Task<LongLivedUserAccessToken?> GetLongLivedUserAccessTokenAsync(string appId, string appSercet, string shortLiveToken)
        {
            try
            {
                var response = await _http.GetStreamAsync($"/oauth/access_token?grant_type=fb_exchange_token&client_id={appId}&client_secret={appSercet}&fb_exchange_token={shortLiveToken}");
                return await JsonSerializer.DeserializeAsync<LongLivedUserAccessToken>(response);
            }
            catch (Exception ex)
            {
                return new LongLivedUserAccessToken
                {
                    AccessToken = ex.ToString()
                };
            }
        }

        public async Task<LongLivedPageAccessToken?> GetLongLivedPageAccessTokenAsync(string pageId, string longLivedUserAccessToken)
        {
            try
            {
                var response = await _http.GetStreamAsync($"/{pageId}?fields=access_token&access_token={longLivedUserAccessToken}");
                return await JsonSerializer.DeserializeAsync<LongLivedPageAccessToken>(response);
            }
            catch (Exception ex)
            {
                return new LongLivedPageAccessToken
                {
                    AccessToken = ex.ToString()
                };
            }
        }

        public async Task<FacebookListResult<FacebookPhoto>> GetPhotosAsync(string id, int limit, string before, string after, string access_token)
        {
            try
            {
                _http.DefaultRequestHeaders.Add("Authorization", $"Bearer {access_token}");
                var response = await _http.GetStreamAsync(id + "/photos?fields=name,picture,images&limit=" + limit + "&before=" + before + "&after=" + after);
                return await JsonSerializer.DeserializeAsync<FacebookListResult<FacebookPhoto>>(response) ?? new FacebookListResult<FacebookPhoto>();
            }
            catch (Exception ex)
            {
                return new FacebookListResult<FacebookPhoto>
                {
                    ErrorMessage = ex.ToString()
                };
            }
        }

        public async Task<FacebookSummary> GetSummaryAsync(string id, string access_token)
        {
            try
            {
                var response = await _http.GetStreamAsync($"{id}?fields=description,name&access_token={access_token}");
                return await JsonSerializer.DeserializeAsync<FacebookSummary>(response) ?? new FacebookSummary();
            }
            catch (Exception ex)
            {
                return new FacebookSummary
                {
                    Description = ex.ToString()
                };
            }
        }

        public async Task<FacebookListResult<FacebookProduct>> GetProductsAsync(string id, string access_token, int limit)
        {
            try
            {
                var response = await _http.GetStreamAsync($"{id}/products?fields=image_url,name,url,price,sale_price&access_token={access_token}&limit={limit}");
                return await JsonSerializer.DeserializeAsync<FacebookListResult<FacebookProduct>>(response) ?? new FacebookListResult<FacebookProduct>();
            }
            catch (Exception ex)
            {
                return new FacebookListResult<FacebookProduct>
                {
                    ErrorMessage = ex.ToString()
                };
            }
        }
    }
}
