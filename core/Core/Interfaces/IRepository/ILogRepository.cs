using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Interfaces.IRepository;

public interface ILogRepository : IAsyncRepository<AppLog>
{
    Task<TResult> DeleteAllAsync();
    Task<ListResult<AppLogListItem>> ListAsync(SearchFilterOptions filterOptions);
    Task TraceAsync(AppLog appLog);
}
