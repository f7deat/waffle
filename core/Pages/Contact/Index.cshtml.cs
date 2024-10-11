using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SendGrid;
using SendGrid.Helpers.Mail;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.Contact
{
    public class IndexModel<TUser> : EntryPageModel where TUser : class
    {
        private readonly UserManager<TUser> _userManager;
        private readonly ISettingService _appSettingService;

        public IndexModel(ICatalogService catalogService, UserManager<TUser> userManager, ISettingService appSettingService) : base(catalogService)
        {
            _userManager = userManager;
            _appSettingService = appSettingService;
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

            var sendGrid = await _appSettingService.GetAsync<ExternalAPI.SendGrids.SendGrid>(nameof(SendGrid));
            if (sendGrid is null)
            {
                IdentityResult = IdentityResult.Failed(new IdentityError
                {
                    Code = "sendGrid",
                    Description = "SendGrid config empty!"
                });
                return Page();
            }

            var domain = SeoHelper.GetDomain(Request);
            var client = new SendGridClient(sendGrid.ApiKey);
            var from = new EmailAddress($"noreply@{domain}", "noreply");
            var to = new EmailAddress(Input.Email, Input.Name);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, "d-e830159691b14f8da2bf91dcb2610d31", new { });
            var response = await client.SendEmailAsync(msg).ConfigureAwait(false);
            if (!IdentityResult.Succeeded)
            {
                return Page();
            }
            return Redirect("/contacts/thank");
        }
    }
}
