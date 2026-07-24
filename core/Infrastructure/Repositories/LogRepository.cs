using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Infrastructure.Repositories;

public class LogRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<AppLog>(context, hcaService), ILogRepository
{
    public async Task<TResult> DeleteAllAsync()
    {
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM AppLogs");
        return TResult.Success;
    }

    public async Task<ListResult<AppLogListItem>> ListAsync(SearchFilterOptions filterOptions)
    {
        var query = from log in _context.AppLogs
                    join user in _context.Users on log.UserId equals user.Id
                    select new AppLogListItem
                    {
                        Id = log.Id,
                        CreatedDate = log.CreatedDate,
                        Message = log.Message,
                        UserId = user.Id,
                        UserName = user.UserName
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.SearchTerm))
        {
            query = query.Where(x => x.Message.Contains(filterOptions.SearchTerm, StringComparison.CurrentCultureIgnoreCase));
        }
        return await ListResult<AppLogListItem>.Success(query, filterOptions);
    }

    public async Task TraceAsync(AppLog appLog) => await _context.AppLogs.AddAsync(appLog);
}
