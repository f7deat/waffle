using Waffle.Entities.Notifications;

namespace Waffle.Models.ViewModels.Notifications;

public class NotificationListItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Content { get; set; }
    public NotificationType Type { get; set; }
    public string? ActionUrl { get; set; }
    public DateTime CreatedDate { get; set; }
    public bool IsRead { get; set; }
}