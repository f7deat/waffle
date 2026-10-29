using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IServices.Users;
using Waffle.Core.Services.Users.Args;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Users;
using Waffle.Models;
using Waffle.Models.Filters;
using Waffle.Models.Params;
using Waffle.Models.ViewModels.Comments;

namespace Waffle.Core.Services;

public class CommentService(ICatalogRepository catalogRepository, ILogService _logService, IHCAService _hcaService, ICommentRepository commentRepository, UserManager<ApplicationUser> userManager, INotificationService _notificationService, ApplicationDbContext context) : ICommentService
{
    private readonly ICommentRepository _commentRepository = commentRepository;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ICatalogRepository _catalogRepository = catalogRepository;
    private readonly ApplicationDbContext _context = context;

    public async Task<IdentityResult> ActiveAsync(Guid id)
    {
        var comment = await _commentRepository.FindAsync(id);
        if (comment is null) return IdentityResult.Failed(new IdentityError
        {
            Code = "dataNotFound",
            Description = "Data not found"
        });

        comment.Status = CommentStatus.Active;
        comment.ModifiedDate = DateTime.UtcNow;
        await _commentRepository.UpdateAsync(comment);
        await _logService.AddAsync($"Active comment {id}");

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> AddAsync(AddComment addComment)
    {
        if (string.IsNullOrWhiteSpace(addComment.Message))
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "dataEmpty",
                Description = "Message empty"
            });
        }
        if (addComment.Message.Length > 5000)
        {
            return Failed("Comment cannot exceed 5000 characters.");
        }
        if (addComment.ParrentId != null && !await AnyAsync(addComment.ParrentId ?? Guid.Empty))
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "DataNotFound",
                Description = "Data not found!"
            });
        }
        var moderationStatus = CommentStatus.Active;
        var matchingRule = await _context.CommentModerationRules
            .Where(rule => rule.IsEnabled)
            .OrderBy(rule => rule.Id)
            .ToListAsync();
        try
        {
            foreach (var rule in matchingRule)
            {
                if (!Regex.IsMatch(addComment.Message, rule.Pattern, RegexOptions.IgnoreCase | RegexOptions.CultureInvariant, TimeSpan.FromMilliseconds(50)))
                {
                    continue;
                }

                moderationStatus = rule.Action == CommentRuleAction.Spam
                    ? CommentStatus.Spam
                    : CommentStatus.Draft;
                rule.MatchCount++;
                break;
            }
        }
        catch (RegexMatchTimeoutException)
        {
            return Failed("Comment moderation timed out. Please try again later.");
        }
        var comment = new Comment
        {
            CreatedDate = DateTime.Now,
            ModifiedDate = DateTime.Now,
            UserId = _hcaService.GetUserId(),
            Status = moderationStatus,
            CatalogId = addComment.CatalogId,
            Content = addComment.Message,
            ParentId = addComment.ParrentId,
            Rating = addComment.Rating,
            Id = Guid.NewGuid()
        };
        await _commentRepository.AddAsync(comment);
        await _notificationService.CreateAsync(new CreateNotificationArgs
        {
            Title = "Có bình luận mới",
            Content = addComment.Message,
            ActionUrl = "/comments",
            RoleName = RoleName.Admin
        });
        return IdentityResult.Success;
    }

    public async Task<bool> AnyAsync(Guid id) => await _commentRepository.Queryable().AnyAsync(x => x.Id == id);

    public async Task<TResult> DeleteAsync(Guid id)
    {
        try
        {
            var comment = await _commentRepository.FindAsync(id);
            if (comment is null)return TResult.Failed("Data not found!");
            await _commentRepository.DeleteAsync(comment);
            await _logService.AddAsync($"Delete comment {id}");
            return TResult.Success;
        }
        catch (Exception ex)
        {
            await _logService.ExceptionAsync(ex);
            return TResult.Failed(ex.Message);
        }
    }

    public async Task<ListResult<CommentListItem>> ListAsync(CommentFilterOptions filterOptions)
    {
        var searchTerm = filterOptions.SearchTerm?.Trim();
        var query = from comment in _commentRepository.Queryable()
                    join user in _userManager.Users on comment.UserId equals user.Id
                    join catalog in _catalogRepository.Queryable() on comment.CatalogId equals catalog.Id
                    where (filterOptions.Status == null || comment.Status == filterOptions.Status)
                        && (filterOptions.CatalogId == Guid.Empty || comment.CatalogId == filterOptions.CatalogId)
                        && (filterOptions.Reported != true || _context.CommentReports.Any(report => report.CommentId == comment.Id))
                        && (searchTerm == null
                            || comment.Content.Contains(searchTerm)
                            || user.UserName!.Contains(searchTerm)
                            || (user.Email != null && user.Email.Contains(searchTerm))
                            || catalog.Name.Contains(searchTerm))
                    orderby comment.IsPinned descending, comment.CreatedDate descending
                    select new CommentListItem
                    {
                        CatalogId = comment.CatalogId,
                        UserId = user.Id,
                        Content = comment.Content,
                        CreatedDate = comment.CreatedDate,
                        Id = comment.Id,
                        ModifiedDate = comment.ModifiedDate,
                        ParentId = comment.ParentId,
                        Status = comment.Status,
                        UserName = user.UserName,
                        UserEmail = user.Email,
                        UserAvatar = user.Avatar,
                        CatalogName = catalog.Name,
                        CatalogUrl = catalog.Url,
                        IsPinned = comment.IsPinned,
                        IsOfficialResponse = comment.IsOfficialResponse,
                        ReportCount = _context.CommentReports.Count(report => report.CommentId == comment.Id),
                        UserCommentCount = _commentRepository.Queryable().Count(item => item.UserId == user.Id),
                        UserViolationCount = _commentRepository.Queryable().Count(item => item.UserId == user.Id && (item.Status == CommentStatus.Spam || item.Status == CommentStatus.Deleted)),
                        ReplyCount = _commentRepository.Queryable().Count(item => item.ParentId == comment.Id)
                    };
        filterOptions.Current = Math.Max(1, filterOptions.Current);
        filterOptions.PageSize = Math.Clamp(filterOptions.PageSize, 1, 100);
        return await ListResult<CommentListItem>.Success(query, filterOptions);
    }

    public async Task<List<CommentCatalogOption>> GetCatalogOptionsAsync() =>
        await (from comment in _commentRepository.Queryable()
               join catalog in _catalogRepository.Queryable() on comment.CatalogId equals catalog.Id
               select new CommentCatalogOption { Id = catalog.Id, Name = catalog.Name })
            .Distinct()
            .OrderBy(catalog => catalog.Name)
            .ToListAsync();

    public Task<ListResult<CommentListItem>> ListInCatalogAsync(CommentFilterOptions filterOptions) => _commentRepository.ListInCatalogAsync(filterOptions);

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
        comment.ModifiedDate = DateTime.UtcNow;

        await _logService.AddAsync($"Remove comment {id}");

        await _commentRepository.UpdateAsync(comment);

        return IdentityResult.Success;
    }

    public async Task<CommentModerationStats> GetModerationStatsAsync()
    {
        var comments = _commentRepository.Queryable();
        return new CommentModerationStats
        {
            TotalToday = await comments.CountAsync(comment => comment.CreatedDate >= DateTime.Today),
            Pending = await comments.CountAsync(comment => comment.Status == CommentStatus.Draft),
            Reported = await comments.CountAsync(comment => _context.CommentReports.Any(report => report.CommentId == comment.Id)),
            Active = await comments.CountAsync(comment => comment.Status == CommentStatus.Active),
            Hidden = await comments.CountAsync(comment => comment.Status == CommentStatus.Hidden),
            Spam = await comments.CountAsync(comment => comment.Status == CommentStatus.Spam)
        };
    }

    public async Task<IdentityResult> ModerateAsync(Guid id, CommentStatus status)
    {
        if (!IsModerationStatus(status))
        {
            return Failed("Invalid moderation status.");
        }

        var comment = await _commentRepository.FindAsync(id);
        if (comment is null)
        {
            return Failed("Comment not found.");
        }

        comment.Status = status;
        comment.ModifiedDate = DateTime.UtcNow;
        await _commentRepository.UpdateAsync(comment);
        await _logService.AddAsync($"Moderate comment {id} as {status}");
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> ModerateRangeAsync(CommentModerationRequest request)
    {
        if (request.Ids is null || !IsModerationStatus(request.Status) || request.Ids.Length is 0 or > 100)
        {
            return Failed("Select between 1 and 100 comments and provide a valid status.");
        }

        var ids = request.Ids.Distinct().ToArray();
        var comments = await _context.Comments.Where(comment => ids.Contains(comment.Id)).ToListAsync();
        if (comments.Count != ids.Length)
        {
            return Failed("One or more comments were not found.");
        }

        foreach (var comment in comments)
        {
            comment.Status = request.Status;
            comment.ModifiedDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        await _logService.AddAsync($"Moderate {comments.Count} comments as {request.Status}");
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> SetPinnedAsync(Guid id, bool isPinned)
    {
        var comment = await _commentRepository.FindAsync(id);
        if (comment is null)
        {
            return Failed("Comment not found.");
        }

        comment.IsPinned = isPinned;
        comment.ModifiedDate = DateTime.UtcNow;
        await _commentRepository.UpdateAsync(comment);
        await _logService.AddAsync($"{(isPinned ? "Pin" : "Unpin")} comment {id}");
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> ReplyAsync(CommentReplyRequest request)
    {
        if (request.CommentId == Guid.Empty || string.IsNullOrWhiteSpace(request.Content) || request.Content.Length > 5000)
        {
            return Failed("Reply must be between 1 and 5000 characters.");
        }

        var parent = await _commentRepository.FindAsync(request.CommentId);
        if (parent is null || parent.Status is CommentStatus.Deleted or CommentStatus.Spam)
        {
            return Failed("Comment not found or cannot be replied to.");
        }

        await _commentRepository.AddAsync(new Comment
        {
            Id = Guid.NewGuid(),
            UserId = _hcaService.GetUserId(),
            CatalogId = parent.CatalogId,
            Content = request.Content.Trim(),
            CreatedDate = DateTime.UtcNow,
            ParentId = parent.Id,
            Status = CommentStatus.Active,
            IsOfficialResponse = true
        });
        await _logService.AddAsync($"Reply to comment {parent.Id}");
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> ReportAsync(Guid id, CommentReportRequest request)
    {
        var userId = _hcaService.GetUserId();
        if (userId == Guid.Empty)
        {
            return Failed("Sign in before reporting a comment.");
        }

        var comment = await _commentRepository.FindAsync(id);
        if (comment is null || comment.Status == CommentStatus.Deleted)
        {
            return Failed("Comment not found.");
        }
        if (comment.UserId == userId)
        {
            return Failed("You cannot report your own comment.");
        }

        var alreadyReported = await _context.CommentReports.AnyAsync(report => report.CommentId == id && report.UserId == userId);
        if (alreadyReported)
        {
            return Failed("You have already reported this comment.");
        }

        var reason = request.Reason?.Trim();
        if (reason is { Length: > 500 })
        {
            return Failed("Report reason cannot exceed 500 characters.");
        }

        _context.CommentReports.Add(new CommentReport
        {
            Id = Guid.NewGuid(),
            CommentId = id,
            UserId = userId,
            Reason = string.IsNullOrWhiteSpace(reason) ? null : reason,
            CreatedDate = DateTime.UtcNow
        });
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Failed("You have already reported this comment.");
        }
        return IdentityResult.Success;
    }

    public async Task<List<CommentModerationRule>> ListModerationRulesAsync() =>
        await _context.CommentModerationRules
            .AsNoTracking()
            .OrderBy(rule => rule.Name)
            .ToListAsync();

    public async Task<IdentityResult> SaveModerationRuleAsync(CommentModerationRuleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Pattern))
        {
            return Failed("A rule name and regex pattern are required.");
        }
        var name = request.Name.Trim();
        var pattern = request.Pattern.Trim();
        if (name.Length > 100 || pattern.Length > 500)
        {
            return Failed("A rule name and a regex pattern (maximum 500 characters) are required.");
        }
        if (request.Description is { Length: > 500 } || !Enum.IsDefined(typeof(CommentRuleAction), request.Action))
        {
            return Failed("The rule description or action is invalid.");
        }

        try
        {
            _ = new Regex(pattern, RegexOptions.IgnoreCase | RegexOptions.CultureInvariant, TimeSpan.FromMilliseconds(50));
        }
        catch (ArgumentException)
        {
            return Failed("The regex pattern is invalid.");
        }

        var rule = request.Id is Guid id
            ? await _context.CommentModerationRules.FindAsync(id)
            : null;
        if (request.Id is not null && rule is null)
        {
            return Failed("Moderation rule not found.");
        }
        if (request.IsEnabled && rule?.IsEnabled != true)
        {
            var enabledCount = await _context.CommentModerationRules.CountAsync(item => item.IsEnabled);
            if (enabledCount >= 20)
            {
                return Failed("At most 20 moderation rules can be enabled.");
            }
        }

        rule ??= new CommentModerationRule { Id = Guid.NewGuid() };
        rule.Name = name;
        rule.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        rule.Pattern = pattern;
        rule.Action = request.Action;
        rule.IsEnabled = request.IsEnabled;
        if (_context.Entry(rule).State == EntityState.Detached)
        {
            _context.CommentModerationRules.Add(rule);
        }
        await _context.SaveChangesAsync();
        await _logService.AddAsync($"Save comment moderation rule {rule.Id}");
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteModerationRuleAsync(Guid id)
    {
        var rule = await _context.CommentModerationRules.FindAsync(id);
        if (rule is null)
        {
            return Failed("Moderation rule not found.");
        }

        _context.CommentModerationRules.Remove(rule);
        await _context.SaveChangesAsync();
        await _logService.AddAsync($"Delete comment moderation rule {id}");
        return IdentityResult.Success;
    }

    private static bool IsModerationStatus(CommentStatus status) =>
        status is CommentStatus.Draft or CommentStatus.Active or CommentStatus.Deleted or CommentStatus.Hidden or CommentStatus.Spam;

    private static IdentityResult Failed(string description) => IdentityResult.Failed(new IdentityError
    {
        Code = "comment.moderationFailed",
        Description = description
    });
}
