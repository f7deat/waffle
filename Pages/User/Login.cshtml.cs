using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.User
{
    public class LoginModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public LoginModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public bool? IsAuthenticated;

        public async Task OnGetAsync()
        {
            var catalog = await _catalogService.EnsureDataAsync("Login", CatalogType.Entry);
            ViewData["Title"] = catalog.Name;
            ViewData["Description"] = catalog.Description;
            ViewData["Image"] = catalog.Thumbnail;

            IsAuthenticated = User.Identity?.IsAuthenticated;

            Console.WriteLine(User.Identity?.Name);
        }
    }
}
