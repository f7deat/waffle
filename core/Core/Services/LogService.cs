using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Services;

public class LogService : ILogService
{
    private readonly ICurrentUser _currentUser;
    private readonly ILogRepository _logRepository;
    private readonly ILogger<LogService> _logger;
    private readonly ITelegramService _telegramService;

    public LogService(ICurrentUser currentUser, ILogRepository appLogRepository, ILogger<LogService> logger, ITelegramService telegramService)
    {
        _currentUser = currentUser;
        _logRepository = appLogRepository;
        _logger = logger;
        _telegramService = telegramService;
    }

    public async Task AddAsync(string message, Guid catalogId)
    {
        await _logRepository.AddAsync(new AppLog
        {
            Message = message,
            CatalogId = catalogId,
            CreatedDate = DateTime.Now,
            UserId = _currentUser.GetId()
        });
    }

    public Task<IdentityResult> DeleteAllAsync() => _logRepository.DeleteAllAsync();

    public async Task<IdentityResult> DeleteAsync(Guid id)
    {
        var log = await _logRepository.FindAsync(id);
        if (log is null)
        {
            _logger.LogTrace("Log {id} not found!", id);
            return IdentityResult.Failed(new IdentityError
            {
                Code = "error.dataNotFound",
                Description = "Log not found!"
            });
        }
        await _logRepository.DeleteAsync(log);
        return IdentityResult.Success;
    }

    public Task<ListResult<AppLogListItem>> ListAsync(SearchFilterOptions filterOptions) => _logRepository.ListAsync(filterOptions);

    public async Task MessageAsync(string text) => await _telegramService.SendMessageAsync(text);
}
