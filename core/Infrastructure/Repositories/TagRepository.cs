using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.IRepositories;
using Waffle.Core.Services.Tags.Filters;
using Waffle.Data;
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
                    where tc.TagId == filterOptions.TagId
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

    public async Task<ListResult> GetPlacesByTagAsync(TagPlaceFilterOptions filterOptions)
    {
        var query = from tc in _context.TagCatalogs
                    join c in _context.Catalogs on tc.CatalogId equals c.Id
                    join p in _context.Places on c.Id equals p.Id
                    where tc.TagId == filterOptions.TagId
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
}
