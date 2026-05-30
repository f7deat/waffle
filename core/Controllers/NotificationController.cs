using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Users;
using Waffle.Core.Services.Users.Args;
using Waffle.Models;

namespace Waffle.Controllers;

public class NotificationController(INotificationService _notificationService) : BaseController
{
    [HttpPost("create"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateNotificationArgs args) => Ok(await _notificationService.CreateAsync(args));

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] SearchFilterOptions filterOptions) => Ok(await _notificationService.ListAsync(filterOptions));

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCountAsync() => Ok(await _notificationService.GetUnreadCountAsync());

    [HttpPost("mark-as-read/{id}")]
    public async Task<IActionResult> MarkAsReadAsync([FromRoute] Guid id) => Ok(await _notificationService.MarkAsReadAsync(id));

    [HttpPost("mark-all-as-read")]
    public async Task<IActionResult> MarkAllAsReadAsync() => Ok(await _notificationService.MarkAllAsReadAsync());
}
