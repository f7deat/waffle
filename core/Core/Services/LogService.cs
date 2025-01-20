using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.Result;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Services;

public class LogService(ICurrentUser _currentUser, ILogRepository _logRepository, ITelegramService _telegramService) : ILogService
{
    public async Task AddAsync(string message, Guid catalogId)
    {
        await _logRepository.AddAsync(new AppLog
        {
            Message = message,
            CatalogId = catalogId,
            CreatedDate = DateTime.Now,
            UserId = _currentUser.GetId(),
            Level = LogLevel.Trace
        });
    }

    public async Task TraceAsync(string message, Guid catalogId)
    {
        await _logRepository.TraceAsync(new AppLog
        {
            Message = message,
            CatalogId = catalogId,
            CreatedDate = DateTime.Now,
            UserId = _currentUser.GetId(),
            Level = LogLevel.Trace
        });
    }


    public Task<IdentityResult> DeleteAllAsync() => _logRepository.DeleteAllAsync();

    public async Task<DefResult> DeleteAsync(Guid id)
    {
        try
        {
            var log = await _logRepository.FindAsync(id);
            if (log is null) return DefResult.Failed("Log not found!");
            await _logRepository.DeleteAsync(log);
            return DefResult.Success;
        }
        catch (Exception ex)
        {
            return DefResult.Failed(ex.ToString());
        }
    }

    public async Task ExceptionAsync(Exception exception)
    {
        await _logRepository.AddAsync(new AppLog
        {
            CreatedDate = DateTime.Now,
            UserId = _currentUser.GetId(),
            Level = LogLevel.Critical,
            Message = exception.ToString()
        });
    }

    public Task<ListResult<AppLogListItem>> ListAsync(SearchFilterOptions filterOptions) => _logRepository.ListAsync(filterOptions);

    public async Task MessageAsync(string text) => await _telegramService.SendMessageAsync(text);
}
