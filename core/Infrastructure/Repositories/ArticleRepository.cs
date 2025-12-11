using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories;

public class ArticleRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Catalog>(context, hcaService), IArticleRepository
{
    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var catalog = await _context.Catalogs.FirstOrDefaultAsync(c => c.NormalizedName == normalizedName);
        if (catalog is null) return TResult.Failed("Catalog not found");
        var query = from wi in _context.WorkItems
                    join wc in _context.WorkContents on wi.WorkId equals wc.Id
                    where wi.CatalogId == catalog.Id && wc.Active
                    select new
                    {
                        wc.Id,
                        wc.Name,
                        wc.Arguments,
                        wc.SortOrder,
                        wc.ComponentId
                    };
        var workContents = await query.ToListAsync();
        return TResult.Ok(workContents);
    }
}
