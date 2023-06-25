using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.Contacts
{
    public class IndexModel<TUser> : EntryPageModel where TUser : class
    {
        private readonly UserManager<TUser> _userManager;
        private readonly IUserStore<TUser> _userStore;
        private readonly IUserEmailStore<TUser> _emailStore;
        public IndexModel(ICatalogService catalogService, UserManager<TUser> userManager, IUserStore<TUser> userStore) : base(catalogService)
        {
            _userManager = userManager;
            _userStore = userStore;
            _emailStore = GetEmailStore();
        }

        [BindProperty]
        public InputModel Input { get; set; } = default!;

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = default!;
            public string? Name { get; set; }
            public string? Address { get; set; }
            [Phone]
            public string? PhoneNumber { get; set; }
            public string? Note { get; set; }
        }

        public IdentityResult IdentityResult { get; set; } = new();

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }
            var user = CreateUser();
            await _userStore.SetUserNameAsync(user, Input.Email, CancellationToken.None);
            await _emailStore.SetEmailAsync(user, Input.Email, CancellationToken.None);
            IdentityResult = await _userManager.CreateAsync(user);
            if (!IdentityResult.Succeeded)
            {
                return Page();
            }
            return Redirect("/contacts/thank");
        }

        private TUser CreateUser()
        {
            try
            {
                return Activator.CreateInstance<TUser>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(TUser)}'.");
            }
        }

        private IUserEmailStore<TUser> GetEmailStore()
        {
            if (!_userManager.SupportsUserEmail)
            {
                throw new NotSupportedException("The default UI requires a user store with email support.");
            }
            return (IUserEmailStore<TUser>)_userStore;
        }
    }
}
