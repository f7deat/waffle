using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
using Waffle.Entities;

namespace Waffle.Pages.Install;

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

    [BindProperty(SupportsGet = true)]
    public string UserName { get; set; } = default!;
    [BindProperty(SupportsGet = true)]
    public string Password { get; set; } = default!;
    [BindProperty(SupportsGet = true)]
    public string ConfirmPassword { get; set; } = default!;
    [BindProperty(SupportsGet = true)]
    public string Name { get; set; } = default!;

    public List<IdentityError>? Errors { get; set; }

    public async Task<IActionResult> OnGetAsync()
    {
        if (await _userManager.Users.AnyAsync()) return Redirect("/install");
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (Password != ConfirmPassword)
        {
            Errors = new List<IdentityError> 
            {
                new IdentityError
                {
                    Code = "error.confirmPassword",
                    Description = "Confirm password not match!"
                } 
            };
            return Page();
        }
        var user = new ApplicationUser
        {
            UserName = UserName,
            Name = Name,
            EmailConfirmed = true
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
        Errors = result.Errors?.ToList();
        return Page();
    }
}
