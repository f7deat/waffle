using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Controllers;

public class ArticleController(IArticleService _articleService) : BaseController
{
    [HttpGet("{normalizedName}"), AllowAnonymous]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string normalizedName) => Ok(await _articleService.GetByNameAsync(normalizedName));
}
