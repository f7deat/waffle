using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Foundations;

namespace Waffle.Pages.Install
{
    public class IndexModel : PageModel
    {
        private readonly IEnumerable<IGenerator> _generators;
        public IndexModel(IEnumerable<IGenerator> generators)
        {
            _generators = generators;
        }

        public void OnGet()
        {

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
}
