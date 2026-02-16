using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Articles.Filters;

namespace Waffle.Controllers;

public class ArticleController(IArticleService _articleService) : BaseController
{
    [HttpGet("{normalizedName}"), AllowAnonymous]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string normalizedName) => Ok(await _articleService.GetByNameAsync(normalizedName));

    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> ListAsync([FromQuery] ArticleFilterOptions filterOptions) => Ok(await _articleService.ListAsync(filterOptions));

    [HttpGet("statistics"), AllowAnonymous]
    public async Task<IActionResult> GetStatisticsAsync([FromQuery] string locale) => Ok(await _articleService.GetStatisticsAsync(locale));
}
