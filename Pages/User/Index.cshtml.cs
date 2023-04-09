using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.User
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly UserManager<IdentityUser> _userService;
        public IndexModel(ICatalogService catalogService, UserManager<IdentityUser> userService)
        {
            _catalogService = catalogService;
            _userService = userService;

        }

        public IdentityUser IdentityUser = new();
        public string Avatar = string.Empty;

        public async Task OnGetAsync()
        {
            var catalog = await _catalogService.EnsureDataAsync("User", Entities.CatalogType.Entry);
            ViewData["Title"] = catalog.Name;
            ViewData["Description"] = catalog.Description;

            IdentityUser = await _userService.GetUserAsync(User);
            Avatar = $"https://www.gravatar.com/avatar/{EncryptHelper.MD5Create(IdentityUser.Email)}?s=520";
        }
    }
}
