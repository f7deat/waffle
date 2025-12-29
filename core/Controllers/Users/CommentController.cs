using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Filters;
using Waffle.Models.Params;

namespace Waffle.Controllers.Users;

public class CommentController(ICommentService commentService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] CommentFilterOptions filterOptions) => Ok(await commentService.ListAsync(filterOptions));

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] AddComment addComment) => Ok(await commentService.AddAsync(addComment));

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await commentService.DeleteAsync(id));

    [HttpPost("remove/{id}")]
    public async Task<IActionResult> RemoveAsync([FromRoute] Guid id) => Ok(await commentService.RemoveAsync(id));

    [HttpPost("active/{id}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await commentService.ActiveAsync(id));
}
