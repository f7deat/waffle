using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters;

namespace Waffle.Core.Interfaces.IService;

public interface ICommentService
{
    Task<IdentityResult> AddAsync(Comment comment);
    Task<bool> AnyAsync(Guid id);
    Task<IdentityResult> DeleteAsync(Guid id);
    Task<IdentityResult> RemoveAsync(Guid id);
    Task<ListResult<Comment>> ListAsync(CommentFilterOptions commentFilter);
}
