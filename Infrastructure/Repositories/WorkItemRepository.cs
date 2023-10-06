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

    public async Task AddItemAsync(Guid catalogId, Guid id)
    {
        await _context.WorkItems.AddAsync(new WorkItem
        {
            CatalogId = catalogId,
            WorkId = id
        });
        await _context.SaveChangesAsync();
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

    public async Task<IEnumerable<Guid>> ListChildIdAsync(Guid parentId)
    {
        return await _context.WorkContents.Where(x => x.ParentId == parentId && x.Active).Select(x => x.Id).ToListAsync();
    }
}
