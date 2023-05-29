using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Encodings.Web;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.User
{
    public class RegisterModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RegisterModel> _logger;
        private readonly IEmailSender _emailSender;
        private readonly IUserEmailStore<ApplicationUser> _emailStore;
        private readonly IUserStore<ApplicationUser> _userStore;
        public RegisterModel(ICatalogService catalogService, UserManager<ApplicationUser> userManager, ILogger<RegisterModel> logger, IEmailSender emailSender, IUserStore<ApplicationUser> userStore)
        {
            _catalogService = catalogService;
            _userManager = userManager;
            _logger = logger;
            _userStore = userStore;
            _emailStore = GetEmailStore();
            _emailSender = emailSender;
        }

        [BindProperty(SupportsGet = true)]
        public string? UserName { get; set; }
        [BindProperty(SupportsGet = true)]
        public string? Email { get; set; }
        [BindProperty(SupportsGet = true)]
        public string? Password { get; set; }
        [BindProperty(SupportsGet = true)]
        public string? ConfirmPassword { get; set; }
        [BindProperty(SupportsGet = true)]
        public bool IsAccept { get; set; }

        public IdentityResult? Result;

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (Password != ConfirmPassword)
            {
                Result = IdentityResult.Failed(new IdentityError
                {
                    Description = "Password not match!"
                });
                return Page();
            }
            var user = CreateUser();

            await _userStore.SetUserNameAsync(user, UserName, CancellationToken.None);
            await _emailStore.SetEmailAsync(user, Email, CancellationToken.None);

            Result = await _userManager.CreateAsync(user, Password);
            if (Result.Succeeded)
            {
                _logger.LogInformation("User created a new account with password.");

                var userId = await _userManager.GetUserIdAsync(user);
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var callbackUrl = Url.Page(
                    "/User/ConfirmEmail",
                    pageHandler: null,
                    values: new { userId, code },
                protocol: Request.Scheme) ?? "/User/ConfirmEmail";

                await _emailSender.SendEmailAsync(Email, "Confirm your email",
                    $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");
            }
            // If we got this far, something failed, redisplay form
            return Page();
        }

        private ApplicationUser CreateUser()
        {
            try
            {
                return Activator.CreateInstance<ApplicationUser>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(ApplicationUser)}'. " +
                    $"Ensure that '{nameof(ApplicationUser)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }

        private IUserEmailStore<ApplicationUser> GetEmailStore()
        {
            if (!_userManager.SupportsUserEmail)
            {
                throw new NotSupportedException("The default UI requires a user store with email support.");
            }
            return (IUserEmailStore<ApplicationUser>)_userStore;
        }
    }
}
