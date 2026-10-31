using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Articles;
using Waffle.Core.Services.Articles.Args;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Core.Services.Articles.Models;

namespace Waffle.Controllers;

public class ArticleController(IArticleService _articleService) : BaseController
{
    [HttpGet("{normalizedName}"), AllowAnonymous]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string normalizedName) => Ok(await _articleService.GetByNameAsync(normalizedName));

    [HttpGet("id/{id}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id) => Ok(await _articleService.GetByIdAsync(id));

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] ArticleFilterOptions filterOptions) => Ok(await _articleService.ListAsync(filterOptions));

    [HttpGet("trash")]
    public async Task<IActionResult> GetDeletedListAsync([FromQuery] ArticleFilterOptions filterOptions) => Ok(await _articleService.GetDeletedListAsync(filterOptions));

    [HttpGet("published-list"), AllowAnonymous]
    public async Task<IActionResult> GetPublishedListAsync([FromQuery] ArticleFilterOptions filterOptions) => Ok(await _articleService.GetPublishedListAsync(filterOptions));

    [HttpGet("featured"), AllowAnonymous]
    public async Task<IActionResult> GetFeaturedAsync([FromQuery] string locale) => Ok(await _articleService.GetFeaturedAsync(locale));

    [HttpGet("trending"), AllowAnonymous]
    public async Task<IActionResult> GetTrendingAsync([FromQuery] string locale) => Ok(await _articleService.GetTrendingAsync(locale));

    [HttpGet("published-categories"), AllowAnonymous]
    public async Task<IActionResult> GetPublishedCategoriesAsync([FromQuery] string locale) => Ok(await _articleService.GetPublishedCategoriesAsync(locale));

    [HttpGet("top-authors"), AllowAnonymous]
    public async Task<IActionResult> GetTopAuthorsAsync([FromQuery] string locale) => Ok(await _articleService.GetTopAuthorsAsync(locale));

    [HttpGet("statistics"), AllowAnonymous]
    public async Task<IActionResult> GetStatisticsAsync([FromQuery] string locale) => Ok(await _articleService.GetStatisticsAsync(locale));

    [HttpGet("randoms"), AllowAnonymous]
    public async Task<IActionResult> GetRandomsAsync([FromQuery] string locale) => Ok(await _articleService.GetRandomsAsync(locale));

    [HttpPost]
    public async Task<IActionResult> AddAsync([FromBody] CreateArticleArgs args, [FromQuery] string locale) => Ok(await _articleService.AddAsync(args, locale));

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateArticleArgs args) => Ok(await _articleService.UpdateAsync(args));

    [HttpPost("{id}/publish")]
    public async Task<IActionResult> PublishAsync([FromRoute] Guid id) => Ok(await _articleService.PublishAsync(id));

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _articleService.DeleteAsync(id));

    [HttpPost("{id}/restore")]
    public async Task<IActionResult> RestoreAsync([FromRoute] Guid id) => Ok(await _articleService.RestoreAsync(id));

    [HttpDelete("{id}/permanent")]
    public async Task<IActionResult> DeletePermanentlyAsync([FromRoute] Guid id) => Ok(await _articleService.DeletePermanentlyAsync(id));

    [HttpGet("meta/{normalizedName}"), AllowAnonymous]
    public async Task<IActionResult> GetMetaAsync([FromRoute] string normalizedName) => Ok(await _articleService.GetMetaAsync(normalizedName));

    [HttpGet("chart-data")]
    public async Task<IActionResult> GetChartDataAsync([FromQuery] string locale) => Ok(await _articleService.GetChartDataAsync(locale));

    [HttpGet("most-viewed")]
    public async Task<IActionResult> GetMostViewedAsync([FromQuery] string locale) => Ok(await _articleService.GetMostViewedAsync(locale));

    [HttpGet("schedule")]
    [ProducesResponseType(typeof(ArticleScheduleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetScheduleAsync(
        [FromQuery] ArticleScheduleFilterOptions filterOptions,
        CancellationToken cancellationToken)
    {
        if (filterOptions.To <= filterOptions.From)
            return BadRequest("The end of the schedule range must be after its start.");
        if (filterOptions.To - filterOptions.From > TimeSpan.FromDays(62))
            return BadRequest("The schedule range cannot exceed 62 days.");
        if (string.IsNullOrWhiteSpace(filterOptions.Locale) || filterOptions.Locale.Length > 10)
            return BadRequest("A valid locale is required.");
        if (filterOptions.Status is not null
            && filterOptions.Status is not ("published" or "scheduled" or "needs-review"))
            return BadRequest("Unsupported schedule status.");

        return Ok(await _articleService.GetScheduleAsync(filterOptions, cancellationToken));
    }

    [HttpPut("{id:guid}/schedule")]
    [ProducesResponseType(typeof(ScheduleArticleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> ScheduleAsync(
        [FromRoute] Guid id,
        [FromBody] ScheduleArticleRequest? request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid || request is null)
            return BadRequest(ModelState);

        try
        {
            var result = await _articleService.ScheduleAsync(id, request.ScheduledAt, cancellationToken);
            return result is null ? NotFound() : Ok(result);
        }
        catch (InvalidArticleScheduleException exception)
        {
            return BadRequest(exception.Message);
        }
        catch (ArticleAlreadyPublishedException exception)
        {
            return Conflict(exception.Message);
        }
    }
}
