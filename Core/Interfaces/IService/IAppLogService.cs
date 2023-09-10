using Microsoft.AspNetCore.Identity;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Interfaces.IService;

public interface IAppLogService
{
    Task AddAsync(string message, Guid catalogId);
    Task<IdentityResult> DeleteAsync(Guid id);
    Task<ListResult<AppLogListItem>> ListAsync(BasicFilterOptions filterOptions);
}
