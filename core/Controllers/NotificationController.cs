using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Users;

namespace Waffle.Controllers;

public class NotificationController(INotificationService _notificationService) : BaseController
{
    [HttpPost("mark-as-read/{id}")]
    public async Task<IActionResult> MarkAsReadAsync([FromRoute] Guid id) => Ok(await _notificationService.MarkAsReadAsync(id));
}
