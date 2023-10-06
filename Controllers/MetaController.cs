using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Waffle.Foundations;

namespace Waffle.Controllers;

public class MetaController : BaseController
{
    [HttpGet("/info"), AllowAnonymous]
    public IActionResult Info()
    {
        var assembly = typeof(Program).Assembly;

        var creationDate = System.IO.File.GetCreationTime(assembly.Location);
        var version = FileVersionInfo.GetVersionInfo(assembly.Location).ProductVersion;

        return Ok($"Version: {version}, Last Updated: {creationDate}");
    }
}
