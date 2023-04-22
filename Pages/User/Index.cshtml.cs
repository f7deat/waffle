using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Helpers;

namespace Waffle.Pages.User
{
    [Authorize]
    public class IndexModel : PageModel
    {
        private readonly UserManager<IdentityUser> _userService;
        public IndexModel(UserManager<IdentityUser> userService)
        {
            _userService = userService;
        }

        public IdentityUser IdentityUser = new();
        public string Avatar = string.Empty;

        public async Task<IActionResult> OnGetAsync()
        {
            IdentityUser = await _userService.GetUserAsync(User);
            Avatar = $"https://www.gravatar.com/avatar/{EncryptHelper.MD5Create(IdentityUser.Email)}?s=520";
            return Page();
        }
    }
}
