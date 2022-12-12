using Microsoft.AspNetCore.Mvc;

namespace Waffle.Controllers
{
    public class ArticleController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}