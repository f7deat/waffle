using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Infrastructure.Repositories;

public class CatalogRepository : EfRepository<Catalog>, ICatalogRepository
{
    public CatalogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<int> CountAsync(CatalogType type) => await _context.Catalogs.CountAsync(x => x.Type == type && x.Active);

    public async Task<Catalog?> FindAsync(Guid catalogId, CatalogType type) => await _context.Catalogs.FirstOrDefaultAsync(x => x.Id == catalogId && x.Type == type);

    public async Task<Catalog?> FindByNameAsync(string? normalizedName)
    {
        if (string.IsNullOrEmpty(normalizedName)) return default;
        return await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName) && x.Active);
    }

    public async Task<IEnumerable<Option>> GetFormSelectAsync(SelectFilterOptions filterOptions)
    {
        var query = _context.Catalogs
            .Where(x => x.Active && x.Type == filterOptions.Type && (string.IsNullOrEmpty(filterOptions.KeyWords) || x.NormalizedName.Contains(filterOptions.KeyWords)) && x.ParentId == null)
            .OrderByDescending(x => x.NormalizedName)
            .Select(x => new Option
            {
                Label = x.Name,
                Value = x.Id
            });
        return await query.ToListAsync();
    }

    public async Task<object?> GetStructureAsync(Guid id)
    {
        var works = await (from i in _context.WorkItems
                           join w in _context.WorkContents on i.WorkId equals w.Id
                           where i.CatalogId == id
                           orderby i.SortOrder ascending
                           select w.Arguments).ToListAsync();
        var data = new
        {
            id,
            works
        };
       return data;
    }

    public async Task<IEnumerable<Catalog>> GetTopViewAsync(CatalogType type)
    {
        return await _context.Catalogs.Where(x => x.Type == type && x.Active)
            .OrderByDescending(x => x.ViewCount)
            .Take(5)
            .ToListAsync();
    }

    public async Task<int> GetViewCountAsync() => await _context.Catalogs.SumAsync(x => x.ViewCount);

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
        if (filterOptions.CreatedBy != null)
        {
            query = query.Where(x => x.CreatedBy == filterOptions.CreatedBy);
        }
        if (string.IsNullOrEmpty(filterOptions.Language))
        {
            query = query.Where(x => x.Language == filterOptions.Language);
        }
        if (SortOrder.Ascending == filterOptions.ModifiedDate)
        {
            query = query.OrderBy(x => x.ModifiedDate);
        }
        else
        {
            query = query.OrderByDescending(x => x.ModifiedDate);
        }

        if (filterOptions.ViewCount != null)
        {
            if (SortOrder.Ascending == filterOptions.ViewCount)
            {
                query = query.OrderBy(x => x.ViewCount);
            }
            else if(SortOrder.Descending == filterOptions.ViewCount)
            {
                query = query.OrderByDescending(x => x.ViewCount);
            }
        }

        return await ListResult<Catalog>.Success(query, filterOptions);
    }

    public async Task<IEnumerable<Catalog>> ListSpotlightAsync(CatalogType type, int pageSize)
    {
        var query = from catalog in _context.Catalogs
                    where catalog.Type == type && catalog.Active
                    select catalog;
        return await query.OrderBy(x => Guid.NewGuid()).Take(pageSize).AsNoTracking().ToListAsync();
    }
}
