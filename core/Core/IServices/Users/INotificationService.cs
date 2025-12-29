using Waffle.Core.Foundations.Models;

namespace Waffle.Core.IServices.Users;

public interface INotificationService
{
    Task<TResult> MarkAsReadAsync(Guid id);
}
