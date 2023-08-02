using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Foundations;

namespace Waffle.Pages;

public class InstallModel : PageModel
{
    private readonly IEnumerable<IGenerator> _generators;
    public InstallModel(IEnumerable<IGenerator> generators)
    {
        _generators = generators;
    }

    public async Task OnGetAsync()
    {
        foreach (var generator in _generators)
        {
            await generator.RunAsync();
        }
    }
}
