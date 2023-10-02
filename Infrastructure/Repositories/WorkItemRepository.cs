using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories;

public class WorkItemRepository : EfRepository<WorkContent>, IWorkContentRepository
{
    public WorkItemRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<WorkContent?> FindByCatalogAsync(Guid catalogId,Guid componentId)
    {
        var query = from item in _context.WorkItems
                    join work in _context.WorkContents on item.WorkId equals work.Id
                    where item.CatalogId == catalogId && work.ComponentId == componentId
                    select work;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<WorkContent>> ListChildAsync(Guid parentId)
    {
        return await _context.WorkContents.Where(x => x.ParentId == parentId)
            .AsNoTracking()
            .ToListAsync();
    }
}
