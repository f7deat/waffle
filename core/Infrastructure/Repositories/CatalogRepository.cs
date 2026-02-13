using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Catalogs.Args;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Tags;
using Waffle.Models;
using Waffle.Models.Components.Common;
using Waffle.Models.ViewModels;

namespace Waffle.Infrastructure.Repositories;

public class CatalogRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Catalog>(context, hcaService), ICatalogRepository
{
    public async Task<int> CountAsync(CatalogType type) => await _context.Catalogs.CountAsync(x => x.Type == type && x.Active);

    public async Task<Catalog?> FindAsync(Guid catalogId, CatalogType type) => await _context.Catalogs.FirstOrDefaultAsync(x => x.Id == catalogId && x.Type == type);

    public async Task<Catalog?> FindByNameAsync(string? normalizedName)
    {
        if (string.IsNullOrEmpty(normalizedName)) return default;
        return await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName) && x.Active);
    }

    public async Task<Catalog?> GetByNameAsync(string normalizedName) => await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName == normalizedName);

    public async Task<dynamic> GetComponentsAsync(Guid id)
    {
        var works = from a in _context.WorkItems
                    join b in _context.WorkContents on a.WorkId equals b.Id
                    join c in _context.Components on b.ComponentId equals c.Id
                    where a.CatalogId == id && b.Active && c.Active
                    select new
                    {
                        c.NormalizedName,
                        b.Name,
                        b.Arguments
                    };
        return await works.ToListAsync();
    }

    public async Task<IEnumerable<Option>> GetFormSelectAsync(SelectOptions filterOptions)
    {
        var query = _context.Catalogs
            .Where(x => x.Active && x.Type == filterOptions.Type && (string.IsNullOrEmpty(filterOptions.KeyWords) || x.NormalizedName.Contains(filterOptions.KeyWords)))
            .Where(x => x.Locale == filterOptions.Locale)
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
                           select w).ToListAsync();
       return works;
    }

    public async Task<object?> GetStructureAsync(string normalizedName)
    {
        var works = await(from i in _context.WorkItems
                          join c in _context.Catalogs on i.CatalogId equals c.Id
                          join w in _context.WorkContents on i.WorkId equals w.Id
                          where c.NormalizedName == normalizedName
                          orderby i.SortOrder ascending
                          select w).ToListAsync();
        return works;
    }

    public async Task<object> GetTagOptionsAsync(SelectOptions selectOptions)
    {
        var query = from t in _context.Tags
                    join tc in _context.TagCatalogs on t.Id equals tc.TagId
                    join c in _context.Catalogs on tc.CatalogId equals c.Id
                    where c.Type == selectOptions.Type
                        && (string.IsNullOrEmpty(selectOptions.KeyWords) || t.NormalizedName.Contains(selectOptions.KeyWords))
                        && c.Locale == selectOptions.Locale
                    select new Option
                    {
                        Label = t.Name,
                        Value = t.Id
                    };
        return await query.ToListAsync();
    }

    public async Task<IEnumerable<Catalog>> GetTopViewAsync(CatalogType type, string locale)
    {
        return await _context.Catalogs
            .Where(x => x.Locale == locale)
            .Where(x => x.Type == type && x.Active)
            .OrderByDescending(x => x.ViewCount)
            .Take(5)
            .ToListAsync();
    }

    public async Task<int> GetViewCountAsync(string locale) => await _context.Catalogs.Where(x => x.Locale == locale).SumAsync(x => x.ViewCount);

    public async Task IncreaseCountAsync(Catalog catalog)
    {
        catalog.ViewCount++;
        _context.Catalogs.Update(catalog);
        await _context.SaveChangesAsync();
    }

    public async Task<ListResult<CatalogListItem>> ListAsync(CatalogFilterOptions filterOptions)
    {
        var query = from catalog in _context.Catalogs
                    select new CatalogListItem
                    {
                        Id = catalog.Id,
                        ParentId = catalog.ParentId,
                        Active = catalog.Active,
                        Description = catalog.Description,
                        NormalizedName = catalog.NormalizedName,
                        CreatedDate = catalog.CreatedDate,
                        Locale = catalog.Locale,
                        ModifiedDate = catalog.ModifiedDate,
                        Name = catalog.Name,
                        Thumbnail = catalog.Thumbnail,
                        Type = catalog.Type,
                        ViewCount = catalog.ViewCount,
                        Url = catalog.Url ?? $"/{catalog.Type}/{catalog.NormalizedName}".ToLower(),
                        CommentCount = _context.Comments.Count(c => c.CatalogId == catalog.Id)
                    };

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
            query = query.Where(x => x.CreatedBy != null && x.CreatedBy.ToLower().Contains(filterOptions.CreatedBy.ToLower()));
        }
        if (!string.IsNullOrEmpty(filterOptions.Locale))
        {
            query = query.Where(x => x.Locale == filterOptions.Locale);
        }
        if (filterOptions.ParentId != null)
        {
            query = query.Where(x => x.ParentId == filterOptions.ParentId);
        }
        if (SortOrder.Ascending == filterOptions.CreatedDate)
        {
            query = query.OrderBy(x => x.CreatedDate);
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedDate);
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

        return await ListResult<CatalogListItem>.Success(query, filterOptions);
    }

    public async Task<IEnumerable<CatalogListItem>> ListSpotlightAsync(PageData pageData, int pageSize)
    {
        var query = from catalog in _context.Catalogs
                    where catalog.Type == pageData.Type && catalog.Active && catalog.Locale == pageData.Locale
                    select new CatalogListItem
                    {
                        Id = catalog.Id,
                        NormalizedName = catalog.NormalizedName,
                        Name = catalog.Name,
                        CreatedDate = catalog.CreatedDate,
                        Description = catalog.Description,
                        ModifiedDate = catalog.ModifiedDate,
                        Thumbnail = catalog.Thumbnail,
                        ViewCount = catalog.ViewCount,
                        Type = catalog.Type,
                        Url = catalog.Url ?? $"/{catalog.Type}/{catalog.NormalizedName}".ToLower()
                    };
        return await query.OrderBy(x => Guid.NewGuid()).Take(pageSize).AsNoTracking().ToListAsync();
    }

    public async Task<TResult> SaveTagsAsync(SaveCatalogTagsArgs args)
    {
        var existingTags = _context.TagCatalogs.Where(x => x.CatalogId == args.CatalogId);
        if (existingTags.Any())
        {
            _context.TagCatalogs.RemoveRange(existingTags);
            await _context.SaveChangesAsync();
        }
        if (args.TagIds != null && args.TagIds.Count > 0)
        {
            await _context.TagCatalogs.AddRangeAsync(args.TagIds.Select(tagId => new TagCatalog
            {
                CatalogId = args.CatalogId,
                TagId = tagId
            }));
            await _context.SaveChangesAsync();
        }
        return TResult.Success;
    }

    public async Task<TResult> TagsAsync(Guid catalogId)
    {
        var query = from tc in _context.TagCatalogs
                    join t in _context.Tags on tc.TagId equals t.Id
                    where tc.CatalogId == catalogId
                    select new
                    {
                        t.Id,
                        t.Name,
                        t.NormalizedName
                    };
        var tags = await query.ToListAsync();
        return TResult.Ok(tags);
    }
}
