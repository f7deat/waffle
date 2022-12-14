using Waffle.ExternalAPI.Google.Models;

namespace Waffle.ExternalAPI.Interfaces
{
    public interface IGoogleService
    {
        Task<Stream> GetDailyTrendingAsync();
        Task<BloggerListResult<BloggerItem>?> BloggerSearchAsync(string blogId, string apiKey, string searchTerm);
        Task<BloggerListResult<BloggerItem>?> BloggerPostsAsync(string? blogId, string? apiKey, int maxResults, string pageToken, string labels);
        Task<BloggerItem?> BloggerGetAsync(string blogId, string postId, string apiKey);
    }
}
