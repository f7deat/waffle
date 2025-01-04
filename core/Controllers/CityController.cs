using Microsoft.AspNetCore.Mvc;
using Waffle.Foundations;

namespace Waffle.Controllers;

public class CityController : BaseController
{
    public IActionResult Index()
    {
        return View();
    }
}
