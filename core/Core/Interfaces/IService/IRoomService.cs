
using Waffle.Models.Result;

namespace Waffle.Core.Interfaces.IService;

public interface IRoomService
{
    Task<DefResult> DeleteAsync(Guid catalogId);
}
