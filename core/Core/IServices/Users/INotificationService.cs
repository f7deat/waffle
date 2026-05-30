using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Users.Args;
using Waffle.Models;
using Waffle.Models.ViewModels.Notifications;

namespace Waffle.Core.IServices.Users;

public interface INotificationService
{
    Task<TResult> CreateAsync(CreateNotificationArgs args);
    Task<ListResult<NotificationListItem>> ListAsync(SearchFilterOptions filterOptions);
    Task<TResult<int>> GetUnreadCountAsync();
    Task<TResult> MarkAsReadAsync(Guid id);
    Task<TResult> MarkAllAsReadAsync();
}
