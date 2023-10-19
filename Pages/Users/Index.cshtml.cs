using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Users;

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
    public ListResult<Catalog>? Articles;

    public async Task<IActionResult> OnGetAsync(Guid? id)
    {
        if (id == null) return NotFound();
        ApplicationUser = await _userManager.FindByIdAsync(id.ToString());
        if (ApplicationUser is null) return NotFound();
        Articles = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Type = CatalogType.Article,
            CreatedBy = id
        });
        return Page();
    }
}
