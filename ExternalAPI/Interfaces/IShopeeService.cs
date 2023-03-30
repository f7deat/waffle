using Waffle.ExternalAPI.Shopee;

namespace Waffle.ExternalAPI.Interfaces
{
    public interface IShopeeService
    {
        Task<BaseInfoAndLinks> GetBaseInfoAndLinksAsync(int pageNum);
        Task<LandingPageLinkList> GetLinkListAsync(string groupId);
    }
}
