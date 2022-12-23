using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Waffle.Pages.Wiki
{
    public class WModel : PageModel
    {
        [BindProperty(SupportsGet = true)]
        public string? Title { get; set; }
        public void OnGet()
        {

        }
    }
}
