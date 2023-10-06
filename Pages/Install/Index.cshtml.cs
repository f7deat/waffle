using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.Install;

public class IndexModel : PageModel
{
    private readonly IEnumerable<IGenerator> _generators;
    private readonly IComponentService _componentService;
    private readonly UserManager<ApplicationUser> _userManager;

    public IndexModel(IEnumerable<IGenerator> generators, IComponentService componentService, UserManager<ApplicationUser> userManager)
    {
        _generators = generators;
        _componentService = componentService;
        _userManager = userManager;
    }

    public IEnumerable<Component> Components = new List<Component>();

    public async Task<IActionResult> OnGetAsync()
    {
        if (!await _userManager.Users.AnyAsync()) return Redirect("/install/firsttime");
        Components = await _componentService.ListAllAsync();
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        foreach (var generator in _generators)
        {
            await generator.RunAsync();
        }
        return Redirect("/install/success");
    }
}
