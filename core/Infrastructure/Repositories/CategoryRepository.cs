using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Categories.Filters;
using Waffle.Data;
using Waffle.Entities.Settings;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories;

public class CategoryRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Category>(context, hcaService), ICategoryRepository
{
    public async Task<ListResult> GetListAsync(CategoryFilterOptions filterOptions)
    {
        var query = from c in _context.Categories
                    where !c.DeletedAt.HasValue
                    select new
                    {
                        c.Id,
                        c.Name,
                        c.Description,
                        c.ParentId,
                        ParentName = _context.Categories
                            .Where(x => !x.DeletedAt.HasValue && x.Id == c.ParentId)
                            .Select(x => x.Name)
                            .FirstOrDefault(),
                        c.Type,
                        c.Locale
                    };

        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            var keyword = filterOptions.Name.ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(keyword));
        }

        if (filterOptions.Type.HasValue)
        {
            query = query.Where(c => c.Type == filterOptions.Type);
        }

        if (filterOptions.ParentId.HasValue)
        {
            query = query.Where(c => c.ParentId == filterOptions.ParentId);
        }

        if (!string.IsNullOrWhiteSpace(filterOptions.Locale))
        {
            query = query.Where(c => c.Locale == filterOptions.Locale);
        }

        query = query.OrderByDescending(c => c.Id);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<IEnumerable<object>> GetOptionsAsync(CategoryOptionFilterOptions filterOptions)
    {
        var query = _context.Categories
            .Where(c => !c.DeletedAt.HasValue)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filterOptions.Locale))
        {
            query = query.Where(c => c.Locale == filterOptions.Locale);
        }

        if (filterOptions.Type.HasValue)
        {
            query = query.Where(c => c.Type == filterOptions.Type.Value);
        }

        if (filterOptions.ExcludeId.HasValue)
        {
            query = query.Where(c => c.Id != filterOptions.ExcludeId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filterOptions.KeyWords))
        {
            var keywords = filterOptions.KeyWords.ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(keywords));
        }

        return await query
            .OrderBy(c => c.Name)
            .Select(c => new
            {
                label = c.Name,
                value = c.Id
            })
            .ToListAsync<object>();
    }
}
