using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters;

namespace Waffle.Core.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    private readonly UserManager<ApplicationUser> _userManager;

    public CommentService(ICommentRepository commentRepository, UserManager<ApplicationUser> userManager)
    {
        _commentRepository = commentRepository;
        _userManager = userManager;
    }

    public async Task<ListResult<Comment>> ListAsync(CommentFilterOptions filterOptions)
    {
        var query = from comment in _commentRepository.Queryable()
                    join user in _userManager.Users on comment.UserId equals user.Id
                    where comment.CatalogId == filterOptions.CatalogId
                    select comment;
        return await ListResult<Comment>.Success(query, filterOptions);
    }
}
