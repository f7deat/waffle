using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.IRepositories;
using Waffle.Core.Services.Tags.Filters;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Tags;
using Waffle.Models;
using Waffle.Models.Components.Common;

namespace Waffle.Infrastructure.Repositories;

public class TagRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Tag>(context, hcaService), ITagRepository
{
    public async Task<ListResult> GetArticlesByTagAsync(TagArticleFilterOptions filterOptions)
    {
        var query = from tc in _context.TagCatalogs
                    join a in _context.Catalogs on tc.CatalogId equals a.Id
                    join t in _context.Tags on tc.TagId equals t.Id
                    where t.NormalizedName == filterOptions.NormalizedName && a.Locale == filterOptions.Locale && a.Type == CatalogType.Article
                    orderby a.ModifiedDate descending
                    select new
                    {
                        a.Id,
                        a.Name,
                        a.Description,
                        a.ViewCount,
                        a.NormalizedName,
                        a.CreatedDate,
                        a.ModifiedDate,
                        a.Thumbnail
                    };
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var tag = await _context.Tags
            .Where(t => t.NormalizedName == normalizedName)
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.NormalizedName
            })
            .FirstOrDefaultAsync();
        return TResult.Ok(tag);
    }

    public async Task<ListResult> GetPlacesByTagAsync(TagPlaceFilterOptions filterOptions)
    {
        var query = from tc in _context.TagCatalogs
                    join c in _context.Catalogs on tc.CatalogId equals c.Id
                    join p in _context.Places on c.Id equals p.Id
                    join t in _context.Tags on tc.TagId equals t.Id
                    where t.NormalizedName == filterOptions.NormalizedName && c.Locale == filterOptions.Locale && c.Type == CatalogType.Location
                    orderby c.ModifiedDate descending
                    select new
                    {
                        p.Id,
                        c.Name,
                        c.Description,
                        c.ViewCount,
                        c.NormalizedName,
                        c.CreatedDate,
                        c.ModifiedDate,
                        c.Thumbnail,
                        p.Address,
                        p.DistrictId
                    };
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<IEnumerable<Option>> GetTagOptionsAsync(SelectOptions selectOptions)
    {
        return await _context.Tags
            .Where(t => string.IsNullOrEmpty(selectOptions.KeyWords) || t.NormalizedName.Contains(selectOptions.KeyWords))
            .OrderBy(t => t.NormalizedName)
            .Select(t => new Option
            {
                Label = t.Name,
                Value = t.Id
            })
            .ToListAsync();
    }

    public Task<bool> IsExistsAsync(string name) => _context.Tags.AnyAsync(t => t.NormalizedName == name);

    public async Task<ListResult> ListAsync(TagFilterOptions filterOptions)
    {
        var query = from t in _context.Tags
                    select new
                    {
                        t.Id,
                        t.NormalizedName,
                        t.Name,
                        CatalogCount = _context.TagCatalogs.Count(tc => tc.TagId == t.Id)
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(t => t.NormalizedName.Contains(filterOptions.Name));
        }
        query = query.OrderBy(x => x.NormalizedName);
        return await ListResult.Success(query, filterOptions);
    }
}
