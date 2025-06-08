using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters;
using Waffle.Models.ViewModels.Comments;

namespace Waffle.Infrastructure.Repositories;

public class CommentRepository : EfRepository<Comment>, ICommentRepository
{
    public CommentRepository(ApplicationDbContext context, IHCAService hcaService) : base(context, hcaService)
    {
    }

    public async Task<ListResult<CommentListItem>> ListInCatalogAsync(CommentFilterOptions filterOptions)
    {
        var query = from comment in _context.Comments
                    join user in _context.Users on comment.UserId equals user.Id
                    where comment.CatalogId == filterOptions.CatalogId && (comment.Status == CommentStatus.Draft || comment.Status == CommentStatus.Active)
                    orderby comment.CreatedDate descending
                    select new CommentListItem
                    {
                        CatalogId = filterOptions.CatalogId,
                        UserId = user.Id,
                        Content = comment.Content,
                        CreatedDate = comment.CreatedDate,
                        Id = comment.Id,
                        ModifiedDate = comment.ModifiedDate,
                        ParentId = comment.ParentId,
                        Status = comment.Status,
                        UserName = user.UserName
                    };
        return await ListResult<CommentListItem>.Success(query, filterOptions);
    }
}
