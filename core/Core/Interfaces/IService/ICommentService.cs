using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations.Models;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters;
using Waffle.Models.Params;
using Waffle.Models.ViewModels.Comments;

namespace Waffle.Core.Interfaces.IService;

public interface ICommentService
{
    Task<IdentityResult> AddAsync(AddComment addComment);
    Task<bool> AnyAsync(Guid id);
    Task<TResult> DeleteAsync(Guid id);
    Task<IdentityResult> RemoveAsync(Guid id);
    Task<ListResult<CommentListItem>> ListAsync(CommentFilterOptions filterOptions);
    Task<ListResult<CommentListItem>> ListInCatalogAsync(CommentFilterOptions filterOptions);
    Task<IdentityResult> ActiveAsync(Guid id);
    Task<CommentModerationStats> GetModerationStatsAsync();
    Task<List<CommentCatalogOption>> GetCatalogOptionsAsync();
    Task<IdentityResult> ModerateAsync(Guid id, CommentStatus status);
    Task<IdentityResult> ModerateRangeAsync(CommentModerationRequest request);
    Task<IdentityResult> SetPinnedAsync(Guid id, bool isPinned);
    Task<IdentityResult> ReplyAsync(CommentReplyRequest request);
    Task<IdentityResult> ReportAsync(Guid id, CommentReportRequest request);
    Task<List<CommentModerationRule>> ListModerationRulesAsync();
    Task<IdentityResult> SaveModerationRuleAsync(CommentModerationRuleRequest request);
    Task<IdentityResult> DeleteModerationRuleAsync(Guid id);
}
