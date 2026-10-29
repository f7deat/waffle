using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models.Filters;
using Waffle.Models.Params;

namespace Waffle.Controllers.Users;

public class CommentController(ICommentService commentService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListInCatalogAsync([FromQuery] CommentFilterOptions filterOptions) =>
        Ok(await commentService.ListInCatalogAsync(filterOptions));

    [HttpGet("admin/list"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> AdminListAsync([FromQuery] CommentFilterOptions filterOptions) =>
        Ok(await commentService.ListAsync(filterOptions));

    [HttpPost]
    public async Task<IActionResult> AddAsync([FromBody] AddComment addComment) => Ok(await commentService.AddAsync(addComment));

    [HttpPost("report/{id:guid}")]
    public async Task<IActionResult> ReportAsync([FromRoute] Guid id, [FromBody] CommentReportRequest? request) =>
        request is null ? BadRequest() : Ok(await commentService.ReportAsync(id, request));

    [HttpDelete("{id:guid}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await commentService.DeleteAsync(id));

    [HttpPost("remove/{id:guid}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> RemoveAsync([FromRoute] Guid id) => Ok(await commentService.RemoveAsync(id));

    [HttpPost("active/{id:guid}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await commentService.ActiveAsync(id));

    [HttpGet("admin/stats"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> ModerationStatsAsync() => Ok(await commentService.GetModerationStatsAsync());

    [HttpGet("admin/catalogs"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> CatalogOptionsAsync() => Ok(await commentService.GetCatalogOptionsAsync());

    [HttpPost("admin/{id:guid}/moderate"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> ModerateAsync([FromRoute] Guid id, [FromBody] CommentStatus status) =>
        Ok(await commentService.ModerateAsync(id, status));

    [HttpPost("admin/bulk-moderate"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> ModerateRangeAsync([FromBody] CommentModerationRequest? request) =>
        request is null ? BadRequest() : Ok(await commentService.ModerateRangeAsync(request));

    [HttpPost("admin/{id:guid}/pin"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> SetPinnedAsync([FromRoute] Guid id, [FromBody] bool? isPinned) =>
        isPinned is null ? BadRequest() : Ok(await commentService.SetPinnedAsync(id, isPinned.Value));

    [HttpPost("admin/reply"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> ReplyAsync([FromBody] CommentReplyRequest? request) =>
        request is null ? BadRequest() : Ok(await commentService.ReplyAsync(request));

    [HttpGet("admin/rules"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> ModerationRulesAsync() => Ok(await commentService.ListModerationRulesAsync());

    [HttpPost("admin/rules"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> SaveModerationRuleAsync([FromBody] CommentModerationRuleRequest? request) =>
        request is null ? BadRequest() : Ok(await commentService.SaveModerationRuleAsync(request));

    [HttpDelete("admin/rules/{id:guid}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteModerationRuleAsync([FromRoute] Guid id) =>
        Ok(await commentService.DeleteModerationRuleAsync(id));
}
