using Microsoft.AspNetCore.Identity;
using Waffle.Models;
using Waffle.Models.Result;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Interfaces.IService;

public interface ILogService
{
    Task AddAsync(string message, Guid catalogId);
    Task<IdentityResult> DeleteAllAsync();
    Task<DefResult> DeleteAsync(Guid id);
    Task<ListResult<AppLogListItem>> ListAsync(SearchFilterOptions filterOptions);
    Task MessageAsync(string text);
    Task ExceptionAsync(Exception exception);
}
