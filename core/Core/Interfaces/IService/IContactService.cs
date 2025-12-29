using Waffle.Core.Foundations.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IContactService
{
    Task<TResult> DeleteAsync(Guid id);
}
