using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.HR.Filters;
using Waffle.Data;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.HR;

public class BranchRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Branch>(context, hcaService), IBranchRepository
{
    public async Task<ListResult> GetListAsync(BranchFilterOptions filterOptions)
    {
        var query = from b in _context.Branches
                    select new
                    {
                        b.Id,
                        b.Name,
                        b.Address,
                        b.Phone,
                        b.Email,
                        DepartmentCount = _context.Departments.Count(d => d.BranchId == b.Id)
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(b => b.Name.ToLower().Contains(filterOptions.Name.ToLower()));
        }
        query = query.OrderByDescending(b => b.Id);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<object> GetOptionsAsync(BranchSelectOptions selecOptions)
    {
        var query = from b in _context.Branches
                    select new
                    {
                        b.Id,
                        b.Name
                    };
        if (!string.IsNullOrWhiteSpace(selecOptions.KeyWords))
        {
            query = query.Where(b => b.Name.ToLower().Contains(selecOptions.KeyWords.ToLower()));
        }
        return await query.Select(b => new
        {
            Label = b.Name,
            Value = b.Id
        }).ToListAsync();
    }
}
