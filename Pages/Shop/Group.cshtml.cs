using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Shopee;

namespace Waffle.Pages.Shop
{
    public class GroupModel : PageModel
    {
        private readonly IShopeeService _shopeeService;
        public GroupModel(IShopeeService shopeeService)
        {
            _shopeeService = shopeeService;
        }

        public LandingPageLinkList Data = new();

        public async Task OnGetAsync(string groupId)
        {
            Data = await _shopeeService.GetLinkListAsync(groupId);
        }
    }
}
