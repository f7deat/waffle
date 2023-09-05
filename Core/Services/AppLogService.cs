using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Core.Services;

public class AppLogService : IAppLogService
{
    private readonly ICurrentUser _currentUser;
    private readonly IAppLogRepository _appLogRepository;

    public AppLogService(ICurrentUser currentUser, IAppLogRepository appLogRepository)
    {
        _currentUser = currentUser;
        _appLogRepository = appLogRepository;
    }

    public async Task AddAsync(string message, Guid catalogId)
    {
        await _appLogRepository.AddAsync(new AppLog
        {
            Message = message,
            CatalogId = catalogId,
            CreatedDate = DateTime.Now,
            UserId = _currentUser.GetId()
        });
    }
}
