using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Infrastructure.Repositories;

public class ArticleRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Catalog>(context, hcaService), IArticleRepository
{
    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var catalog = await _context.Catalogs.FirstOrDefaultAsync(c => c.NormalizedName == normalizedName);
        if (catalog is null) return TResult.Failed("Catalog not found");
        var query = from wi in _context.WorkItems
                    join wc in _context.WorkContents on wi.WorkId equals wc.Id
                    join c in _context.Components on wc.ComponentId equals c.Id
                    where wi.CatalogId == catalog.Id && wc.Active && c.NormalizedName == nameof(Editor)
                    select wc.Arguments;
        var workContents = await query.FirstOrDefaultAsync();
        return TResult.Ok(new
        {
            catalog.Id,
            catalog.Name,
            catalog.NormalizedName,
            catalog.Description,
            catalog.ModifiedDate,
            catalog.Thumbnail,
            catalog.ViewCount,
            Content = workContents != null ? System.Text.Json.JsonSerializer.Deserialize<object>(workContents) : new {}
        });
    }

    public Task<int> GetCurrentMonthAsync(string locale) => _context.Catalogs.CountAsync(c => c.Active && c.Locale == locale && c.Type == CatalogType.Article && c.CreatedDate.Month == DateTime.UtcNow.Month && c.CreatedDate.Year == DateTime.Now.Year);

    public Task<int> GetPreviousMonthAsync(string locale) => _context.Catalogs.CountAsync(c => c.Active && c.Locale == locale && c.Type == CatalogType.Article && c.CreatedDate.Month == DateTime.UtcNow.AddMonths(-1).Month && c.CreatedDate.Year == DateTime.Now.Year);

    public Task<int> GetTotalArticlesAsync(string locale) => _context.Catalogs.CountAsync(c => c.Active && c.Locale == locale && c.Type == CatalogType.Article);

    public Task<int> GetTotalViewCountAsync(string locale) => _context.Catalogs.Where(c => c.Active && c.Locale == locale && c.Type == CatalogType.Article).SumAsync(c => c.ViewCount);

    public async Task<ListResult> ListAsync(ArticleFilterOptions filterOptions)
    {
        var query = from c in _context.Catalogs
                    where c.Active && c.Locale == filterOptions.Locale && c.Type == CatalogType.Article
                    select new
                    {
                        c.Id,
                        c.Name,
                        c.ViewCount,
                        c.NormalizedName,
                        c.ModifiedDate,
                        c.Thumbnail,
                        c.Description
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        query = query.OrderByDescending(x => x.ModifiedDate);
        return await ListResult.Success(query, filterOptions);
    }
}
