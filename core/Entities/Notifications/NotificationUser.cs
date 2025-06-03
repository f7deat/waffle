using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Notifications;

public class NotificationUser
{
    public Guid UserId { get; set; }
    [ForeignKey(nameof(Notification))]
    public Guid NotificationId { get; set; }
    public bool IsRead { get; set; }

    public virtual Notification? Notification { get; set; }
}
