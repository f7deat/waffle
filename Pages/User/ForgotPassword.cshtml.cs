using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Pages.User
{
    public class ForgotPasswordModel : Microsoft.AspNetCore.Identity.UI.V4.Pages.Account.Internal.ForgotPasswordModel
    {
        private readonly ICatalogService _catalogService;
        public ForgotPasswordModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }
        public async Task OnGetAsync()
        {
            var catalog = await _catalogService.EnsureDataAsync("ForgotPassword", Entities.CatalogType.Entry);
            ViewData["Title"] = catalog.Name;
            ViewData["Description"] = catalog.Description;
            ViewData["Image"] = catalog.Thumbnail;
        }
    }
}
