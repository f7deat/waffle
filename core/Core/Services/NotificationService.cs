using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models.Result;

namespace Waffle.Core.Services;

public class NotificationService : INotificationService
{
    public Task<DefResult> MarkAsReadAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}
