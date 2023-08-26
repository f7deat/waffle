using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.Params;

namespace Waffle.Controllers;

public class HomeController : Controller
{
    private readonly ICatalogService _catalogService;
    private readonly ITelegramService _telegramService;
    public HomeController(ICatalogService catalogService, ITelegramService telegramService)
    {
        _catalogService = catalogService;
        _telegramService = telegramService;
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });

    [HttpPost]
    public async Task<IActionResult> Subscribe(SubscribeArgs args)
    {
        if (string.IsNullOrWhiteSpace(args.Email)) return BadRequest();
        await _telegramService.SendErrorAsync($"{args.Email} started following website!");
        var catalog = await _catalogService.EnsureDataAsync("thank-to-subscribe");
        return Redirect($"/leaf/{catalog.NormalizedName}");
    }

    [Route("/post/{url}-{id}.html")]
    public IActionResult Post(string url, string id)
    {
        return RedirectPermanent($"/article/{url}");
    }
}