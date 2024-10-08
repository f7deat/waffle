﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters;
using Waffle.Models.Params;
using Waffle.Models.ViewModels.Comments;

namespace Waffle.Core.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    private readonly ICurrentUser _currentUser;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<CommentService> _logger;
    private readonly ILogRepository _appLogRepository;
    private readonly ICatalogRepository _catalogRepository;

    public CommentService(ICatalogRepository catalogRepository, ILogger<CommentService> logger, ILogRepository appLogRepository, ICurrentUser currentUser, ICommentRepository commentRepository, UserManager<ApplicationUser> userManager)
    {
        _commentRepository = commentRepository;
        _userManager = userManager;
        _currentUser = currentUser;
        _logger = logger;
        _appLogRepository = appLogRepository;
        _catalogRepository = catalogRepository;
    }

    public async Task<IdentityResult> ActiveAsync(Guid id)
    {
        var comment = await _commentRepository.FindAsync(id);
        if (comment is null) return IdentityResult.Failed(new IdentityError
        {
            Code = "dataNotFound",
            Description = "Data not found"
        });

        comment.Status = CommentStatus.Active;
        await _commentRepository.UpdateAsync(comment);

        _logger.LogInformation("User {userId} Active comment {commentId}", _currentUser.GetId(), id);

        await _appLogRepository.AddAsync(new AppLog
        {
            CatalogId = comment.CatalogId,
            CreatedDate = DateTime.Now,
            UserId = _currentUser.GetId(),
            Message = $"Active comment {id}"
        });

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
        if (addComment.ParrentId != null && !await AnyAsync(addComment.ParrentId ?? Guid.Empty))
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "DataNotFound",
                Description = "Data not found!"
            });
        }
        var comment = new Comment
        {
            CreatedDate = DateTime.Now,
            ModifiedDate = DateTime.Now,
            UserId = _currentUser.GetId(),
            Status = CommentStatus.Active,
            CatalogId = addComment.CatalogId,
            Content = addComment.Message,
            ParentId = addComment.ParrentId
        };
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
        _logger.LogInformation("Delete comment {id}", id);

        await _appLogRepository.AddAsync(new AppLog
        {
            CatalogId = comment.CatalogId,
            CreatedDate = DateTime.Now,
            UserId = _currentUser.GetId(),
            Message = $"Delete comment {id}"
        });

        return IdentityResult.Success;
    }

    public async Task<ListResult<CommentListItem>> ListAsync(CommentFilterOptions filterOptions)
    {
        var query = from comment in _commentRepository.Queryable()
                    join user in _userManager.Users on comment.UserId equals user.Id
                    join catalog in _catalogRepository.Queryable() on comment.CatalogId equals catalog.Id
                    where filterOptions.Status == null || comment.Status == filterOptions.Status
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
                        CatalogName = catalog.Name
                    };
        return await ListResult<CommentListItem>.Success(query, filterOptions);
    }

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

        _logger.LogInformation("Remove comment {id}", id);

        await _commentRepository.UpdateAsync(comment);

        await _appLogRepository.AddAsync(new AppLog
        {
            CatalogId = comment.CatalogId,
            CreatedDate = DateTime.Now,
            UserId = _currentUser.GetId(),
            Message = $"Remove comment {id}"
        });

        return IdentityResult.Success;
    }
}
