using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.IServices.Users;
using Waffle.Core.Services.Users.Args;
using Waffle.Data;
using Waffle.Entities.Notifications;
using Waffle.Models;
using Waffle.Models.ViewModels.Notifications;

namespace Waffle.Core.Services;

public class NotificationService(ApplicationDbContext _context, IHCAService _hcaService) : INotificationService
{
    public async Task<TResult> CreateAsync(CreateNotificationArgs args)
    {
        if (string.IsNullOrWhiteSpace(args.Title)) return TResult.Failed("Title is required!");

        var userIds = new HashSet<Guid>();

        if (args.AllUsers)
        {
            var allUserIds = await _context.Users.Select(x => x.Id).ToListAsync();
            foreach (var userId in allUserIds)
            {
                userIds.Add(userId);
            }
        }

        if (args.UserIds is not null)
        {
            foreach (var userId in args.UserIds.Where(x => x != Guid.Empty))
            {
                userIds.Add(userId);
            }
        }

        if (!string.IsNullOrWhiteSpace(args.RoleName))
        {
            var roleName = args.RoleName.Trim().ToLower();
            var roleUserIds = await (from userRole in _context.UserRoles
                                     join role in _context.Roles on userRole.RoleId equals role.Id
                                     where role.Name != null && role.Name.ToLower() == roleName
                                     select userRole.UserId).ToListAsync();

            foreach (var userId in roleUserIds)
            {
                userIds.Add(userId);
            }
        }

        if (userIds.Count == 0) return TResult.Failed("No target users found!");

        var notification = new Notification
        {
            Title = args.Title.Trim(),
            Content = string.IsNullOrWhiteSpace(args.Content) ? null : args.Content.Trim(),
            ActionUrl = string.IsNullOrWhiteSpace(args.ActionUrl) ? null : args.ActionUrl.Trim(),
            Type = args.Type,
            CreatedBy = _hcaService.GetUserId(),
            CreatedDate = DateTime.UtcNow,
        };

        await _context.Notifications.AddAsync(notification);
        await _context.SaveChangesAsync();

        await _context.NotificationUsers.AddRangeAsync(userIds.Select(userId => new NotificationUser
        {
            NotificationId = notification.Id,
            UserId = userId,
            IsRead = false,
        }));

        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<ListResult<NotificationListItem>> ListAsync(SearchFilterOptions filterOptions)
    {
        var userId = _hcaService.GetUserId();
        if (userId == Guid.Empty) return ListResult<NotificationListItem>.Failed("User not found!");

        var query = from notificationUser in _context.NotificationUsers
                    join notification in _context.Notifications on notificationUser.NotificationId equals notification.Id
                    where notificationUser.UserId == userId
                    select new NotificationListItem
                    {
                        Id = notification.Id,
                        Title = notification.Title,
                        Content = notification.Content,
                        Type = notification.Type,
                        ActionUrl = notification.ActionUrl ?? (notification.Type == NotificationType.User ? "/users/member" : "/home"),
                        CreatedDate = notification.CreatedDate,
                        IsRead = notificationUser.IsRead
                    };

        if (!string.IsNullOrWhiteSpace(filterOptions.SearchTerm))
        {
            var keyword = filterOptions.SearchTerm.Trim().ToLower();
            query = query.Where(x => x.Title.ToLower().Contains(keyword) || (x.Content ?? string.Empty).ToLower().Contains(keyword));
        }

        query = query.OrderBy(x => x.IsRead).ThenByDescending(x => x.CreatedDate);
        return await ListResult<NotificationListItem>.Success(query, filterOptions);
    }

    public async Task<TResult<int>> GetUnreadCountAsync()
    {
        try
        {
            var userId = _hcaService.GetUserId();
            if (userId == Guid.Empty) return TResult<int>.Failed("User not found!");

            var count = await _context.NotificationUsers.CountAsync(x => x.UserId == userId && !x.IsRead);
            return TResult<int>.Ok(count);
        }
        catch (Exception ex)
        {
            return TResult<int>.Failed($"An error occurred while retrieving unread notification count: {ex.Message}");
        }
    }

    public async Task<TResult> MarkAsReadAsync(Guid id)
    {
        var userId = _hcaService.GetUserId();
        if (userId == Guid.Empty) return TResult.Failed("User not found!");

        var notificationUser = await _context.NotificationUsers.FirstOrDefaultAsync(x => x.UserId == userId && x.NotificationId == id);
        if (notificationUser is null) return TResult.Failed("Notification not found!");

        if (!notificationUser.IsRead)
        {
            notificationUser.IsRead = true;
            await _context.SaveChangesAsync();
        }

        return TResult.Success;
    }

    public async Task<TResult> MarkAllAsReadAsync()
    {
        var userId = _hcaService.GetUserId();
        if (userId == Guid.Empty) return TResult.Failed("User not found!");

        var notifications = await _context.NotificationUsers.Where(x => x.UserId == userId && !x.IsRead).ToListAsync();
        if (notifications.Count == 0) return TResult.Success;

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }
        await _context.SaveChangesAsync();
        return TResult.Success;
    }
}
