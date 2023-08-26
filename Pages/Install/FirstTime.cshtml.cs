using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Constants;
using Waffle.Entities;

namespace Waffle.Pages.Install
{
    public class FirstTimeModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<FirstTimeModel> _logger;
        private readonly RoleManager<ApplicationRole> _roleManager;
        public FirstTimeModel(UserManager<ApplicationUser> userManager, ILogger<FirstTimeModel> logger, RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _logger = logger;
            _roleManager = roleManager;
        }

        [BindProperty]
        public string UserName { get; set; } = default!;
        [BindProperty]
        public string Password { get; set; } = default!;

        public IEnumerable<IdentityError> Errors { get; set; } = new List<IdentityError>();

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var user = new ApplicationUser
            {
                UserName = UserName
            };
            var result = await _userManager.CreateAsync(user, Password);
            if (result.Succeeded)
            {
                _logger.LogInformation("Create user {UserName}", UserName);
                if (!await _roleManager.RoleExistsAsync(RoleName.Admin))
                {
                    var role = new ApplicationRole
                    {
                        Name = RoleName.Admin
                    };
                    await _roleManager.CreateAsync(role);
                }
                await _userManager.AddToRoleAsync(user, RoleName.Admin);
                return Redirect("/install/success");
            }
            Errors = result.Errors;
            return Page();
        }
    }
}
