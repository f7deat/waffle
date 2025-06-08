using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Infrastructure.Repositories;

public class LogRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<AppLog>(context, hcaService), ILogRepository
{
    public async Task<IdentityResult> DeleteAllAsync()
    {
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM AppLogs");
        return IdentityResult.Success;
    }

    public async Task<ListResult<AppLogListItem>> ListAsync(SearchFilterOptions filterOptions)
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
                        UserName = user.UserName,
                        CatalogName = catalog.Name
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.SearchTerm))
        {
            query = query.Where(x => x.Message.Contains(filterOptions.SearchTerm, StringComparison.CurrentCultureIgnoreCase));
        }
        return await ListResult<AppLogListItem>.Success(query, filterOptions);
    }

    public async Task TraceAsync(AppLog appLog) => await _context.AppLogs.AddAsync(appLog);
}
