using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.User;

public class IndexModel : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ICatalogService _catalogService;

    public IndexModel(UserManager<ApplicationUser> userManager, ICatalogService catalogService)
    {
        _userManager = userManager;
        _catalogService = catalogService;
    }

    public ApplicationUser ApplicationUser = new();
    public ListResult<CatalogListItem>? Articles;

    public async Task<IActionResult> OnGetAsync(Guid? id)
    {
        var userId = id?.ToString();
        if (string.IsNullOrEmpty(userId)) return Redirect("/user/login");
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return Redirect("/user/login");
        ApplicationUser = user;
        Articles = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Type = CatalogType.Article,
            CreatedBy = user.UserName
        });
        return Page();
    }
}
