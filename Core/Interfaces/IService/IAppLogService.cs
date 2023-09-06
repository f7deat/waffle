namespace Waffle.Core.Interfaces.IService;

public interface IAppLogService
{
    Task AddAsync(string message, Guid catalogId);
}
