using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;

namespace Waffle.Controllers;

public class CountryController : BaseController
{
    public IActionResult Index()
    {
        return View();
    }
}
