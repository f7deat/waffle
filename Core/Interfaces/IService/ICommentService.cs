using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters;

namespace Waffle.Core.Interfaces.IService;

public interface ICommentService
{
    Task<ListResult<Comment>> ListAsync(CommentFilterOptions commentFilter);
}
