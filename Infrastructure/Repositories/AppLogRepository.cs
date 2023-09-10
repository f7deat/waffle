using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Infrastructure.Repositories;

public class AppLogRepository : EfRepository<AppLog>, IAppLogRepository
{
    public AppLogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ListResult<AppLogListItem>> ListAsync(BasicFilterOptions filterOptions)
    {
        var query = from log in _context.AppLogs
                    join catalog in _context.Catalogs on log.CatalogId equals catalog.Id
                    join user in _context.Users on log.UserId equals user.Id
                    select new AppLogListItem
                    {
                        CatalogId = catalog.Id,
                        Id = log.Id,
                        CreatedDate = log.CreatedDate,
                        Message = log.Message,
                        UserId = user.Id,
                        UserName = user.UserName
                    };
        return await ListResult<AppLogListItem>.Success(query, filterOptions);
    }
}
