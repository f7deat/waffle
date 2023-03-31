using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Shopee;
using Waffle.Models.Components;

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
        public string GroupId = string.Empty;
        [BindProperty(SupportsGet = true)]
        public int Current { get; set; } = 1;
        public Pagination Pagination => new()
        {
            HasNextPage = Data.TotalCount > Current * 12,
            HasPrevPage = Current > 1,
            NextPageUrl = $"/shop/group/{GroupId}?current={Current + 1}",
            PrevPageUrl = $"/shop/group/{GroupId}?current={Current - 1}",
        };

        public async Task<IActionResult> OnGetAsync(string groupId)
        {
            if (string.IsNullOrEmpty(groupId)) {
                return NotFound();
            }
            ViewData["Title"] = groupId;
            GroupId = groupId;
            Data = await _shopeeService.GetLinkListAsync(groupId);
            return Page();
        }
    }
}
