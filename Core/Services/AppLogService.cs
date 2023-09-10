using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Services;

public class AppLogService : IAppLogService
{
    private readonly ICurrentUser _currentUser;
    private readonly IAppLogRepository _appLogRepository;
    private readonly ILogger<AppLogService> _logger;

    public AppLogService(ICurrentUser currentUser, IAppLogRepository appLogRepository, ILogger<AppLogService> logger)
    {
        _currentUser = currentUser;
        _appLogRepository = appLogRepository;
        _logger = logger;
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

    public async Task<IdentityResult> DeleteAsync(Guid id)
    {
        var log = await _appLogRepository.FindAsync(id);
        if (log is null)
        {
            _logger.LogTrace("Log {id} not found!", id);
            return IdentityResult.Failed(new IdentityError
            {
                Code = "error.dataNotFound",
                Description = "Log not found!"
            });
        }
        await _appLogRepository.DeleteAsync(log);
        return IdentityResult.Success;
    }

    public Task<ListResult<AppLogListItem>> ListAsync(BasicFilterOptions filterOptions) => _appLogRepository.ListAsync(filterOptions);
}
