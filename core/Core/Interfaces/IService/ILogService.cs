using Waffle.Core.Foundations.Models;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Interfaces.IService;

public interface ILogService
{
    Task AddAsync(string message, Guid catalogId);
    Task<TResult> DeleteAllAsync();
    Task<TResult> DeleteAsync(Guid id);
    Task<ListResult<AppLogListItem>> ListAsync(SearchFilterOptions filterOptions);
    Task MessageAsync(string text);
    Task ExceptionAsync(Exception exception);
}
