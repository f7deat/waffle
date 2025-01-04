using Microsoft.AspNetCore.Mvc;
using Waffle.Foundations;

namespace Waffle.Controllers;

public class CountryController : BaseController
{
    public IActionResult Index()
    {
        return View();
    }
}
