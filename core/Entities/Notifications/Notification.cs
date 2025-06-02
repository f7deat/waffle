using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Notifications;

public class Notification : AuditEntity
{
    [StringLength(512)]
    public string Title { get; set; } = default!;
    public string? Content { get; set; }
    public NotificationType Type { get; set; }

    public virtual ICollection<NotificationUser>? NotificationUsers { get; set; }
}

public enum NotificationType
{
    System = 0,
    User = 1,
}