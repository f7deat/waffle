using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Interfaces
{
    public interface IFacebookService
    {
        Task<List<Album>?> GetAlbumsAsync(string pageId, string access_token);
        Task<LongLivedUserAccessToken?> GetLongLivedUserAccessTokenAsync(string appId, string appSercet, string shortLiveToken);
        Task<LongLivedPageAccessToken?> GetLongLivedPageAccessTokenAsync(string appId, string longLivedUserAccessToken);
    }
}
