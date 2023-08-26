using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Helpers;
using Waffle.Entities;

namespace Waffle.Pages.User;

public class IndexModel : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;
    public IndexModel(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public ApplicationUser ApplicationUser = new();
    public string Avatar = string.Empty;
    public bool IsCurrentUser = false;

    public async Task<IActionResult> OnGetAsync(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            if (!User.Identity?.IsAuthenticated ?? false)
            {
                return Unauthorized();
            }
            ApplicationUser = await _userManager.GetUserAsync(User);
            Avatar = $"https://www.gravatar.com/avatar/{EncryptHelper.MD5Create(ApplicationUser.Email)}?s=520";
            IsCurrentUser = true;
        }
        else
        {
            ApplicationUser = await _userManager.FindByNameAsync(id);
            if (ApplicationUser is null)
            {
                return NotFound();
            }
            Avatar = $"https://www.gravatar.com/avatar/{EncryptHelper.MD5Create(ApplicationUser.Email)}?s=520";
            if (User.Identity?.IsAuthenticated ?? false)
            {
                var currentUser = await _userManager.GetUserAsync(User);
                IsCurrentUser = currentUser.UserName.Equals(id, StringComparison.OrdinalIgnoreCase);
            }
        }
        return Page();
    }
}
