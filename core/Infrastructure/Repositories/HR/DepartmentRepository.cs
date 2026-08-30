using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.HR.Filters;
using Waffle.Data;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.HR;

public class DepartmentRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Department>(context, hcaService), IDepartmentRepository
{
    public async Task<ListResult> GetListAsync(DepartmentFilterOptions filterOptions)
    {
        var query = from d in _context.Departments
                    select new
                    {
                        d.Id,
                        d.Name,
                        d.BranchId,
                        BranchName = d.Branch != null ? d.Branch.Name : null,
                        TeamCount = _context.Teams.Count(t => t.DepartmentId == d.Id)
                    };
        if (filterOptions.BranchId.HasValue)
        {
            query = query.Where(d => d.BranchId == filterOptions.BranchId);
        }
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(d => d.Name.ToLower().Contains(filterOptions.Name.ToLower()));
        }
        query = query.OrderByDescending(d => d.Id);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<object> GetOptionsAsync(DepartmentSelectOptions selecOptions)
    {
        var query = from d in _context.Departments
                    select new
                    {
                        d.Id,
                        d.Name,
                        d.BranchId
                    };
        if (selecOptions.BranchId.HasValue)
        {
            query = query.Where(d => d.BranchId == selecOptions.BranchId);
        }
        if (!string.IsNullOrWhiteSpace(selecOptions.KeyWords))
        {
            query = query.Where(d => d.Name.ToLower().Contains(selecOptions.KeyWords.ToLower()));
        }
        return await query.Select(d => new
        {
            Label = d.Name,
            Value = d.Id
        }).ToListAsync();
    }
}
