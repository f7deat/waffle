using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Helpers;
using Waffle.Entities;

namespace Waffle.Pages.User
{
    [Authorize]
    public class IndexModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public IndexModel(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public ApplicationUser IdentityUser = new();
        public string Avatar = string.Empty;

        public async Task<IActionResult> OnGetAsync()
        {
            IdentityUser = await _userManager.GetUserAsync(User);
            Avatar = $"https://www.gravatar.com/avatar/{EncryptHelper.MD5Create(IdentityUser.Email)}?s=520";
            return Page();
        }
    }
}
