using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models.Filters;

namespace Waffle.ViewComponents;

public class CommentViewComponent : BaseViewComponent<Comment>
{
    private readonly ICommentService _commentService;
    public CommentViewComponent(ICommentService commentService, IWorkService workService) : base(workService)
    {
        _commentService = commentService;
    }

    protected override async Task<Comment?> ExtendAsync(Comment? work)
    {
        var comment = await _commentService.ListAsync(new CommentFilterOptions
        {
            CatalogId = PageData.Id
        });
        
        return work;
    }
}
