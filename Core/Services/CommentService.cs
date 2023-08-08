using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters;

namespace Waffle.Core.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    private IHttpContextAccessor _httpContextAccessor;
    private readonly UserManager<ApplicationUser> _userManager;

    public CommentService(IHttpContextAccessor httpContextAccessor, ICommentRepository commentRepository, UserManager<ApplicationUser> userManager)
    {
        _commentRepository = commentRepository;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<IdentityResult> AddAsync(Comment comment)
    {
        comment.CreatedDate = DateTime.Now;
        comment.ModifiedDate = DateTime.Now;
        comment.Status = CommentStatus.Active;
        await _commentRepository.AddAsync(comment);
        return IdentityResult.Success;
    }

    public async Task<bool> AnyAsync(Guid id) => await _commentRepository.Queryable().AnyAsync(x => x.Id == id);

    public async Task<IdentityResult> DeleteAsync(Guid id)
    {
        var comment = await _commentRepository.FindAsync(id);
        if (comment is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "error.dataNotFound",
                Description = "Data not found!"
            });
        }
        await _commentRepository.DeleteAsync(comment);
        return IdentityResult.Success;
    }

    public async Task<ListResult<Comment>> ListAsync(CommentFilterOptions filterOptions)
    {
        var query = from comment in _commentRepository.Queryable()
                    join user in _userManager.Users on comment.UserId equals user.Id
                    where comment.CatalogId == filterOptions.CatalogId
                    select comment;
        return await ListResult<Comment>.Success(query, filterOptions);
    }

    public async Task<IdentityResult> RemoveAsync(Guid id)
    {
        var comment = await _commentRepository.FindAsync(id);
        if (comment is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "error.dataNotFound",
                Description = "Data not found!"
            });
        }
        comment.Status = CommentStatus.Deleted;
        return IdentityResult.Success;
    }
}
