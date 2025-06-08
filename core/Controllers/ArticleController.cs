using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;

namespace Waffle.Controllers;

public class ArticleController : BaseController
{
    [HttpPost("save")]
    public IActionResult SaveAsync() => Ok();
}
