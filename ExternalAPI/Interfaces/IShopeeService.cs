using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Interfaces
{
    public interface IShopeeService
    {
        Task<BaseInfoAndLinks> GetBaseInfoAndLinksAsync(int pageNum);
        Task<LandingPageLinkList> GetLinkListAsync(string groupId, string searchTerm);
        Task<LandingPageLinkList> GetLinkListsAsync(string tag);
    }
}
