using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Constants;

namespace Waffle.Pages.User;

public class LogoutModel : PageModel
{
    public void OnGet()
    {
        Response.Cookies.Delete(CookieKey.Token);
    }
}
