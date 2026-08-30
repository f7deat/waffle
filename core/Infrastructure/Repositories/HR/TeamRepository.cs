using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.HR.Filters;
using Waffle.Data;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.HR;

public class TeamRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Team>(context, hcaService), ITeamRepository
{
    public async Task<ListResult> GetListAsync(TeamFilterOptions filterOptions)
    {
        var query = from t in _context.Teams
                    select new
                    {
                        t.Id,
                        t.Name,
                        t.DepartmentId,
                        DepartmentName = t.Department != null ? t.Department.Name : null
                    };
        if (filterOptions.DepartmentId.HasValue)
        {
            query = query.Where(t => t.DepartmentId == filterOptions.DepartmentId);
        }
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(t => t.Name.ToLower().Contains(filterOptions.Name.ToLower()));
        }
        query = query.OrderByDescending(t => t.Id);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<object> GetOptionsAsync(TeamSelectOptions selecOptions)
    {
        var query = from t in _context.Teams
                    select new
                    {
                        t.Id,
                        t.Name,
                        t.DepartmentId
                    };
        if (selecOptions.DepartmentId.HasValue)
        {
            query = query.Where(t => t.DepartmentId == selecOptions.DepartmentId);
        }
        if (!string.IsNullOrWhiteSpace(selecOptions.KeyWords))
        {
            query = query.Where(t => t.Name.ToLower().Contains(selecOptions.KeyWords.ToLower()));
        }
        return await query.Select(t => new
        {
            Label = t.Name,
            Value = t.Id
        }).ToListAsync();
    }
}
