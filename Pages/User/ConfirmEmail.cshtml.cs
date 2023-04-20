using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.User
{
    public class ConfirmEmailModel : PageModel
    {
        private readonly ILogger<ConfirmEmailModel> _logger;
        private readonly UserManager<IdentityUser> _userManager;
        public ConfirmEmailModel(ILogger<ConfirmEmailModel> logger, UserManager<IdentityUser> userManager)
        {
            _logger = logger;
            _userManager = userManager;

        }

        public IdentityResult Result = IdentityResult.Success;

        public async Task<IActionResult> OnGetAsync(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return RedirectToPage("/Index");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{userId}'.");
            }

            Result = await _userManager.ConfirmEmailAsync(user, code);
            if (!Result.Succeeded)
            {
                _logger.LogWarning($"Error confirming email for user with ID '{userId}':");
            }

            return Page();
        }
    }
}
