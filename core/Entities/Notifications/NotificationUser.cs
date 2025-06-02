using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Notifications;

public class NotificationUser
{
    [Key, Column(Order = 0)]
    public Guid UserId { get; set; }
    [Key, Column(Order = 1)]
    [ForeignKey(nameof(Notification))]
    public Guid NotificationId { get; set; }
    public bool IsRead { get; set; }

    public virtual Notification? Notification { get; set; }
}
