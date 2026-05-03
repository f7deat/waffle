using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Articles.Args;
using Waffle.Core.Services.Articles.Filters;

namespace Waffle.Controllers;

public class ArticleController(IArticleService _articleService) : BaseController
{
    [HttpGet("{normalizedName}"), AllowAnonymous]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string normalizedName) => Ok(await _articleService.GetByNameAsync(normalizedName));

    [HttpGet("id/{id}"), AllowAnonymous]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id) => Ok(await _articleService.GetByIdAsync(id));

    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> ListAsync([FromQuery] ArticleFilterOptions filterOptions) => Ok(await _articleService.ListAsync(filterOptions));

    [HttpGet("statistics"), AllowAnonymous]
    public async Task<IActionResult> GetStatisticsAsync([FromQuery] string locale) => Ok(await _articleService.GetStatisticsAsync(locale));

    [HttpGet("randoms"), AllowAnonymous]
    public async Task<IActionResult> GetRandomsAsync([FromQuery] string locale) => Ok(await _articleService.GetRandomsAsync(locale));

    [HttpPost("add"), Authorize]
    public async Task<IActionResult> AddAsync([FromBody] CreateArticleArgs args, [FromQuery] string locale) => Ok(await _articleService.AddAsync(args, locale));

    [HttpPost("update"), Authorize]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateArticleArgs args) => Ok(await _articleService.UpdateAsync(args));

    [HttpDelete("delete/{id}"), Authorize]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _articleService.DeleteAsync(id));
}
