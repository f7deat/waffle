using Waffle.Entities.Notifications;

namespace Waffle.Core.Services.Users.Args;

public class CreateNotificationArgs
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? ActionUrl { get; set; }
    public NotificationType Type { get; set; } = NotificationType.System;
    public bool AllUsers { get; set; }
    public string? RoleName { get; set; }
    public IEnumerable<Guid>? UserIds { get; set; }
}