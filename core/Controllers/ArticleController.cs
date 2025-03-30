using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;

namespace Waffle.Controllers;

public class ArticleController : BaseController
{
    public IActionResult Index()
    {
        return View();
    }
}
