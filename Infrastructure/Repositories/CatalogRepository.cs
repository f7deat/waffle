using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Infrastructure.Repositories;

public class CatalogRepository : EfRepository<Catalog>, ICatalogRepository
{
    public CatalogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Catalog?> FindByNameAsync(string? normalizedName)
    {
        if (string.IsNullOrEmpty(normalizedName)) return default;
        return await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName) && x.Active);
    }

    public async Task<IEnumerable<Option>> GetFormSelectAsync(string keywords)
    {
        var query = _context.Catalogs
            .Where(x => x.Active && x.Type != CatalogType.Tag && x.Type != CatalogType.Entry && x.NormalizedName.Contains(keywords))
            .OrderByDescending(x => x.NormalizedName)
            .Select(x => new Option
            {
                Label = x.Name,
                Value = x.Id
            });
        return await query.ToListAsync();
    }

    public async Task<ListResult<Catalog>> ListAsync(CatalogFilterOptions filterOptions)
    {
        var query = _context.Catalogs.Where(x => filterOptions.ParentId == null || x.ParentId == filterOptions.ParentId);

        if (!string.IsNullOrEmpty(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        if (filterOptions.Active != null)
        {
            query = query.Where(x => x.Active == filterOptions.Active);    
        }
        if (filterOptions.Type != null)
        {
            query = query.Where(x => x.Type == filterOptions.Type);
        }

        return await ListResult<Catalog>.Success(query.OrderByDescending(x => x.ModifiedDate), filterOptions);
    }
}
