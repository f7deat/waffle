using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Interfaces.IRepository;

public interface IAppLogRepository : IAsyncRepository<AppLog>
{
    Task<ListResult<AppLogListItem>> ListAsync(BasicFilterOptions filterOptions);
}
