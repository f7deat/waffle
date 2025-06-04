using Waffle.Models.Result;

namespace Waffle.Core.Interfaces.IService;

public interface INotificationService
{
    Task<DefResult> MarkAsReadAsync(Guid id);
}
