using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Helpers;
using Waffle.Entities;

namespace Waffle.Pages.Users;

public class IndexModel : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;
    public IndexModel(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public ApplicationUser ApplicationUser = new();

    public async Task<IActionResult> OnGetAsync(string id)
    {
        if (string.IsNullOrEmpty(id)) return NotFound();
        ApplicationUser = await _userManager.FindByIdAsync(id);
        if (ApplicationUser is null) return NotFound();
        return Page();
    }
}
