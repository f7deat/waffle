using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;

namespace Waffle.Pages.Contact;

public class IndexModel<TUser> : EntryPageModel where TUser : class
{
    private readonly UserManager<TUser> _userManager;
    private readonly ISettingService _settingService;
    private readonly ApplicationDbContext _context;
    private readonly ILocalizationService _localizationService;

    public IndexModel(ICatalogService catalogService, UserManager<TUser> userManager, ISettingService settingService, ApplicationDbContext context, ILocalizationService localizationService) : base(catalogService)
    {
        _userManager = userManager;
        _settingService = settingService;
        _context = context;
        _localizationService = localizationService;
    }

    [BindProperty]
    public Entities.Contact Input { get; set; } = default!;

    public IdentityResult IdentityResult { get; set; } = IdentityResult.Success;

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        var sendGrid = await _settingService.GetAsync<ExternalAPI.SendGrids.SendGrid>(nameof(SendGrid));
        if (sendGrid != null)
        {
            var domain = SeoHelper.GetDomain(Request);
            var client = new SendGridClient(sendGrid.ApiKey);
            var from = new EmailAddress($"noreply@{domain}", "noreply");
            var to = new EmailAddress(Input.Email, Input.Name);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, "d-e830159691b14f8da2bf91dcb2610d31", new { });
            await client.SendEmailAsync(msg);
        }

        if (string.IsNullOrWhiteSpace(Input.Name))
        {
            IdentityResult.Failed(new IdentityError
            {
                Code = HttpStatusCode.BadRequest.ToString(),
                Description = await _localizationService.GetAsync("NameIsRequired")
            });
            return Page();
        }

        await _context.Contacts.AddAsync(Input);
        await _context.SaveChangesAsync();

        if (!IdentityResult.Succeeded)
        {
            return Page();
        }
        return Redirect("/contact/thank");
    }
}
