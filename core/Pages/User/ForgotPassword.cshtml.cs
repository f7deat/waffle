using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.Users;

public class ForgotPasswordModel : Microsoft.AspNetCore.Identity.UI.V4.Pages.Account.Internal.ForgotPasswordModel
{
    private readonly UserManager<ApplicationUser> _userManager; 
    private readonly IEmailSender _emailSender;
    private readonly ILocalizationService _localizationService;

    public ForgotPasswordModel(UserManager<ApplicationUser> userManager, IEmailSender emailSender, ILocalizationService localizationService)
    {
        _userManager = userManager;
        _emailSender = emailSender;
        _localizationService = localizationService;
    }

    public string Error { get; set; } = string.Empty;

    public override async Task<IActionResult> OnPostAsync()
    {
        var user = await _userManager.FindByEmailAsync(Input.Email);
        if (user is null)
        {
            Error = await _localizationService.GetAsync("user.not_found"); ;
            return Page();
        }
        if (!user.EmailConfirmed)
        {
            Error = await _localizationService.GetAsync("user.email_not_confirm");
            return Page();
        }

        // For more information on how to enable account confirmation and password reset please
        // visit https://go.microsoft.com/fwlink/?LinkID=532713
        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        var callbackUrl = Url.Page(
            "/User/ResetPassword",
            pageHandler: null,
            values: new { code },
            protocol: Request.Scheme) ?? "/";

        await _emailSender.SendEmailAsync(
            Input.Email,
            "Reset Password",
            $"Please reset your password by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

        return RedirectToPage("./ForgotPasswordConfirmation");
    }
}
