using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories;

public class ArticleRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Article>(context, hcaService), IArticleRepository
{
    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var article = await _context.Articles.FirstOrDefaultAsync(a => a.NormalizedName == normalizedName);
        if (article is null) return TResult.Failed("Article not found");
        return TResult.Ok(new
        {
            article.Id,
            article.Name,
            article.NormalizedName,
            article.Description,
            article.ModifiedDate,
            article.Thumbnail,
            article.ViewCount,
            article.PublishedAt,
            article.CreatedDate,
            Content = !string.IsNullOrEmpty(article.Content) ? System.Text.Json.JsonSerializer.Deserialize<object>(article.Content) : new { }
        });
    }

    public Task<int> GetCurrentMonthAsync(string locale) => _context.Articles.CountAsync(a => a.PublishedAt != null && a.Locale == locale && a.PublishedAt.Value.Month == DateTime.UtcNow.Month && a.PublishedAt.Value.Year == DateTime.Now.Year);

    public Task<int> GetPreviousMonthAsync(string locale) => _context.Articles.CountAsync(a => a.PublishedAt != null && a.Locale == locale && a.PublishedAt.Value.Month == DateTime.UtcNow.AddMonths(-1).Month && a.PublishedAt.Value.Year == DateTime.Now.Year);

    public async Task<ListResult> GetPublishedListAsync(ArticleFilterOptions filterOptions)
    {
        var query = from a in _context.Articles
                    where a.PublishedAt != null && a.Locale == filterOptions.Locale
                    select new
                    {
                        a.Id,
                        a.Name,
                        a.ViewCount,
                        a.NormalizedName,
                        a.ModifiedDate,
                        a.Thumbnail,
                        a.Description,
                        a.CreatedDate,
                        a.PublishedAt
                    };
        query = query.OrderBy(x => x.PublishedAt);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<TResult> GetRandomsAsync(string locale)
    {
        var query = from a in _context.Articles
                    where a.PublishedAt != null && a.Locale == locale
                    select new
                    {
                        a.Id,
                        a.Name,
                        a.ViewCount,
                        a.NormalizedName,
                        a.ModifiedDate,
                        a.Thumbnail,
                        a.Description,
                        a.CreatedDate,
                        a.PublishedAt
                    };
        query = query.OrderBy(x => Guid.NewGuid());
        return TResult.Ok(await query.Take(5).ToListAsync());
    }

    public Task<int> GetTotalArticlesAsync(string locale) => _context.Articles.CountAsync(a => a.PublishedAt != null && a.Locale == locale);

    public Task<int> GetTotalViewCountAsync(string locale) => _context.Articles.Where(a => a.PublishedAt != null && a.Locale == locale).SumAsync(a => a.ViewCount);

    public async Task<ListResult> ListAsync(ArticleFilterOptions filterOptions)
    {
        var query = from a in _context.Articles
                    join u in _context.Users on a.CreatedBy equals u.Id
                    where a.Locale == filterOptions.Locale
                    select new
                    {
                        a.Id,
                        a.Name,
                        a.ViewCount,
                        a.NormalizedName,
                        a.ModifiedDate,
                        a.Thumbnail,
                        a.Description,
                        a.CreatedDate,
                        a.PublishedAt,
                        CreatorName = u.Name,
                        CreatorAvatar = u.Avatar,
                        CreatorId = u.Id
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        query = query.OrderByDescending(x => x.ModifiedDate);
        return await ListResult.Success(query, filterOptions);
    }
}
