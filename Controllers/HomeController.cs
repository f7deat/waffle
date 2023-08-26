using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Waffle.Models;

namespace Waffle.Controllers;

public class HomeController : Controller
{
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });

    [HttpPost]
    public IActionResult Subscribe() => Redirect("/page/thank");

    [Route("/post/{url}-{id}.html")]
    public IActionResult Post(string url, string id)
    {
        return RedirectPermanent($"/article/{url}");
    }
}