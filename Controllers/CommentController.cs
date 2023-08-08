using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Infrastructure.Repositories;
using Waffle.Models.Params;

namespace Waffle.Controllers;

public class CommentController : BaseController
{
    private readonly IAppLogRepository _appLogRepository;
    private readonly ICommentService _commentService;

    public CommentController(IAppLogRepository appLogRepository, ICommentService commentService)
    {
        _appLogRepository = appLogRepository;
        _commentService = commentService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] AddComment addComment)
    {
        if (addComment.ParrentId != null && !await _commentService.AnyAsync(addComment.ParrentId ?? Guid.Empty))
        {
            return Ok(IdentityResult.Failed(new IdentityError
            {
                Code = "DataNotFound",
                Description = "Data not found!"
            }));
        }
        var comment = new Comment
        {
            CatalogId = addComment.CatalogId,
            Content = addComment.Message,
            UserId = User.GetId(),
            ParrentId = addComment.ParrentId
        };
        return Ok(await _commentService.AddAsync(comment));
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _commentService.DeleteAsync(id));

    [HttpPost("remove/{id}")]
    public async Task<IActionResult> RemoveAsync([FromRoute] Guid id)
    {
        return Ok(await _commentService.RemoveAsync(id));
    }
}
