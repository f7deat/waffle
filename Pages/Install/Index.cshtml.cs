using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.Install;

public class IndexModel : PageModel
{
    private readonly IEnumerable<IGenerator> _generators;
    private readonly IComponentService _componentService;

    public IndexModel(IEnumerable<IGenerator> generators, IComponentService componentService)
    {
        _generators = generators;
        _componentService = componentService;
    }

    public IEnumerable<Component> Components = new List<Component>();

    public async Task OnGetAsync()
    {
        Components = await _componentService.ListAllAsync();
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
