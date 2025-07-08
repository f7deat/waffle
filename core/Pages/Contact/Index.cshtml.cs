using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Data;

namespace Waffle.Pages.Contact;

public class IndexModel<TUser> : EntryPageModel where TUser : class
{
    private readonly ApplicationDbContext _context;
    private readonly ILocalizationService _localizationService;
    private readonly SettingOptions Options;

    public IndexModel(ICatalogService catalogService, IOptions<SettingOptions> options, ApplicationDbContext context, ILocalizationService localizationService) : base(catalogService)
    {
        _context = context;
        _localizationService = localizationService;
        Options = options.Value;
    }

    [BindProperty]
    public Entities.Contact Input { get; set; } = default!;
    public string Theme = "Default";

    public IdentityResult IdentityResult { get; set; } = IdentityResult.Success;

    public void OnGet()
    {
        Theme = Options.Theme;
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
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
        if (string.IsNullOrWhiteSpace(Input.Email) || !EmailHelper.IsValid(Input.Email))
        {
            IdentityResult.Failed(new IdentityError
            {
                Code = HttpStatusCode.BadRequest.ToString(),
                Description = await _localizationService.GetAsync("EmailIsInvalid")
            });
            return Page();
        }
        Input.CreatedDate = DateTime.Now;
        await _context.Contacts.AddAsync(Input);
        await _context.SaveChangesAsync();

        if (!IdentityResult.Succeeded)
        {
            return Page();
        }
        return Redirect("/contact/thank");
    }
}
