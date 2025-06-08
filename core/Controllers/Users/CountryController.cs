using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;

namespace Waffle.Controllers.Users;

public class CountryController : BaseController
{
    [HttpGet("options"), AllowAnonymous]
    public IActionResult OptionsAsync() => Ok();
}
