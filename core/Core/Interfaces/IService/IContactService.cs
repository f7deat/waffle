using Waffle.Models.Result;

namespace Waffle.Core.Interfaces.IService;

public interface IContactService
{
    Task<DefResult> DeleteAsync(Guid id);
}
