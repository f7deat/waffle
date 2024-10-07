using Microsoft.AspNetCore.Mvc;

namespace Waffle.ViewComponents.Landing;

public class AboutUsViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View();
    }
}
