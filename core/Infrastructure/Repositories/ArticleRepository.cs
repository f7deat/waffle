using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Articles;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Core.Services.Articles.Models;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories;

public class ArticleRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Article>(context, hcaService), IArticleRepository
{
    private sealed record ArticleScheduleRaw(
        Guid Id,
        string Name,
        DateTime? PublishedAt,
        DateTimeOffset? ScheduledAt,
        int? CategoryId,
        string? CategoryName,
        Guid CreatorId,
        string? CreatorName,
        string? Thumbnail,
        string? Description,
        string? Content,
        int ViewCount);

    public async Task<ArticleScheduleResponse> GetScheduleAsync(
        ArticleScheduleFilterOptions filterOptions,
        CancellationToken cancellationToken)
    {
        var from = filterOptions.From.UtcDateTime;
        var to = filterOptions.To.UtcDateTime;
        var articleQuery = _context.Articles.AsNoTracking()
            .Where(article => article.DeletedAt == null && article.Locale == filterOptions.Locale
                && ((article.ScheduledAt.HasValue && article.ScheduledAt >= filterOptions.From && article.ScheduledAt < filterOptions.To)
                    || (article.PublishedAt.HasValue && article.PublishedAt >= from && article.PublishedAt < to)));
        if (filterOptions.CategoryId.HasValue)
            articleQuery = articleQuery.Where(article => article.CategoryId == filterOptions.CategoryId);
        if (filterOptions.CreatorId.HasValue)
            articleQuery = articleQuery.Where(article => article.CreatedBy == filterOptions.CreatorId);
        if (string.Equals(filterOptions.Status, "published", StringComparison.OrdinalIgnoreCase))
            articleQuery = articleQuery.Where(article => article.PublishedAt.HasValue);
        else if (string.Equals(filterOptions.Status, "scheduled", StringComparison.OrdinalIgnoreCase))
            articleQuery = articleQuery.Where(article => article.ScheduledAt.HasValue);
        else if (string.Equals(filterOptions.Status, "needs-review", StringComparison.OrdinalIgnoreCase))
            articleQuery = articleQuery.Where(article => string.IsNullOrWhiteSpace(article.Description)
                || string.IsNullOrWhiteSpace(article.Thumbnail)
                || string.IsNullOrWhiteSpace(article.Content));

        var rows = await (
            from article in articleQuery
            join category in _context.Categories on article.CategoryId equals category.Id into categories
            from category in categories.DefaultIfEmpty()
            join user in _context.Users on article.CreatedBy equals user.Id into users
            from user in users.DefaultIfEmpty()
            select new ArticleScheduleRaw(
                article.Id,
                article.Name,
                article.PublishedAt,
                article.ScheduledAt,
                article.CategoryId,
                category == null ? null : category.Name,
                article.CreatedBy,
                user == null ? null : user.Name,
                article.Thumbnail,
                article.Description,
                article.Content,
                article.ViewCount))
            .ToListAsync(cancellationToken);

        var articles = rows
            .OrderBy(article => article.ScheduledAt ?? ToUtcOffset(article.PublishedAt))
            .Select(ToScheduleItem)
            .ToList();
        var drafts = await (
            from article in _context.Articles.AsNoTracking()
            join category in _context.Categories on article.CategoryId equals category.Id into categories
            from category in categories.DefaultIfEmpty()
            join user in _context.Users on article.CreatedBy equals user.Id into users
            from user in users.DefaultIfEmpty()
            where article.DeletedAt == null
                && article.Locale == filterOptions.Locale
                && article.PublishedAt == null
                && article.ScheduledAt == null
            orderby article.CreatedDate descending
            select new ArticleScheduleRaw(
                article.Id,
                article.Name,
                article.PublishedAt,
                article.ScheduledAt,
                article.CategoryId,
                category == null ? null : category.Name,
                article.CreatedBy,
                user == null ? null : user.Name,
                article.Thumbnail,
                article.Description,
                article.Content,
                article.ViewCount))
            .Take(100)
            .ToListAsync(cancellationToken);

        var categories = await _context.Categories.AsNoTracking()
            .Where(category => !category.DeletedAt.HasValue && category.Locale == filterOptions.Locale
                && category.Type == Waffle.Entities.Settings.CategoryType.Article)
            .OrderBy(category => category.Name)
            .Select(category => new ArticleScheduleCategoryResponse(category.Id, category.Name))
            .ToListAsync(cancellationToken);

        var authors = await (
            from article in _context.Articles.AsNoTracking()
            join user in _context.Users on article.CreatedBy equals user.Id
            where article.DeletedAt == null && article.Locale == filterOptions.Locale
            select new { user.Id, user.Name })
            .Distinct()
            .OrderBy(author => author.Name)
            .Select(author => new ArticleScheduleAuthorResponse(author.Id, author.Name ?? author.Id.ToString()))
            .ToListAsync(cancellationToken);

        return new ArticleScheduleResponse(
            articles,
            drafts.Select(ToScheduleItem).ToList(),
            categories,
            authors);
    }

    public async Task<ScheduleArticleResponse?> ScheduleArticleAsync(
        Guid id,
        DateTimeOffset? scheduledAt,
        DateTimeOffset modifiedAt,
        CancellationToken cancellationToken)
    {
        var article = await _context.Articles
            .FirstOrDefaultAsync(article => article.Id == id && article.DeletedAt == null, cancellationToken);
        if (article is null) return null;
        if (article.PublishedAt.HasValue)
            throw new ArticleAlreadyPublishedException();

        article.ScheduledAt = scheduledAt;
        article.ModifiedDate = modifiedAt.UtcDateTime;
        await _context.SaveChangesAsync(cancellationToken);
        return new ScheduleArticleResponse(article.Id, article.ScheduledAt);
    }

    public async Task<int> PublishScheduledArticlesAsync(DateTimeOffset now, CancellationToken cancellationToken)
    {
        var dueArticles = await _context.Articles
            .Where(article => article.DeletedAt == null && article.ScheduledAt.HasValue && article.ScheduledAt <= now)
            .ToListAsync(cancellationToken);

        foreach (var article in dueArticles)
        {
            article.PublishedAt = article.ScheduledAt!.Value.UtcDateTime;
            article.ScheduledAt = null;
            article.ModifiedDate = now.UtcDateTime;
        }

        if (dueArticles.Count > 0)
            await _context.SaveChangesAsync(cancellationToken);

        return dueArticles.Count;
    }

    private static ArticleScheduleItemResponse ToScheduleItem(ArticleScheduleRaw article)
    {
        return new ArticleScheduleItemResponse(
            article.Id,
            article.Name,
            ToUtcOffset(article.PublishedAt),
            article.ScheduledAt,
            article.CategoryId,
            article.CategoryName,
            article.CreatorId,
            article.CreatorName,
            article.Thumbnail,
            article.ViewCount,
            !string.IsNullOrWhiteSpace(article.Description)
                && !string.IsNullOrWhiteSpace(article.Thumbnail)
                && !string.IsNullOrWhiteSpace(article.Content));
    }

    private static DateTimeOffset? ToUtcOffset(DateTime? value) =>
        value.HasValue
            ? new DateTimeOffset(DateTime.SpecifyKind(value.Value, DateTimeKind.Utc))
            : null;

    public Task<Article?> FindByNameAsync(string normalizedName) =>
        _context.Articles.FirstOrDefaultAsync(a =>
            a.NormalizedName == normalizedName
            && a.DeletedAt == null
            && a.PublishedAt.HasValue
            && a.PublishedAt <= DateTime.UtcNow);

    private static object GetArticleContent(string? content)
    {
        if (string.IsNullOrWhiteSpace(content)) return new { };
        try
        {
            return JsonSerializer.Deserialize<object>(content ?? "{}") ?? new { };
        }
        catch
        {
            return new { };
        }
    }

    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var article = await _context.Articles.FirstOrDefaultAsync(a =>
            a.NormalizedName == normalizedName
            && a.DeletedAt == null
            && a.PublishedAt.HasValue
            && a.PublishedAt <= DateTime.UtcNow);
        if (article is null) return TResult.Failed("Article not found");
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == article.CreatedBy);
        article.ViewCount++;
        _context.Articles.Update(article);
        await _context.SaveChangesAsync();
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
            article.Locale,
            article.CreatedBy,
            Content = GetArticleContent(article.Content),
            CreatorName = user?.Name,
            CreatorAvatar = user?.Avatar,
            CreatorUserName = user?.UserName
        });
    }

    public Task<int> GetCurrentMonthAsync(string locale) => _context.Articles.CountAsync(a => a.DeletedAt == null && a.PublishedAt != null && a.PublishedAt <= DateTime.UtcNow && a.Locale == locale && a.PublishedAt.Value.Month == DateTime.UtcNow.Month && a.PublishedAt.Value.Year == DateTime.UtcNow.Year);

    public Task<int> GetPreviousMonthAsync(string locale) => _context.Articles.CountAsync(a => a.DeletedAt == null && a.PublishedAt != null && a.PublishedAt <= DateTime.UtcNow && a.Locale == locale && a.PublishedAt.Value.Month == DateTime.UtcNow.AddMonths(-1).Month && a.PublishedAt.Value.Year == DateTime.UtcNow.AddMonths(-1).Year);

    public async Task<ListResult> GetPublishedListAsync(ArticleFilterOptions filterOptions)
    {
        var query = from a in _context.Articles
                    join c in _context.Categories on a.CategoryId equals c.Id into categoryJoin
                    from c in categoryJoin.DefaultIfEmpty()
                    where a.DeletedAt == null && a.PublishedAt != null && a.PublishedAt <= DateTime.UtcNow && a.Locale == filterOptions.Locale
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
                        a.CategoryId,
                        CategoryName = c.Name
                    };
        query = query.OrderByDescending(x => x.PublishedAt);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<TResult> GetRandomsAsync(string locale)
    {
        var query = from a in _context.Articles
                    where a.DeletedAt == null && a.PublishedAt != null && a.PublishedAt <= DateTime.UtcNow && a.Locale == locale
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

    public Task<int> GetTotalArticlesAsync(string locale) => _context.Articles.CountAsync(a => a.DeletedAt == null && a.PublishedAt != null && a.PublishedAt <= DateTime.UtcNow && a.Locale == locale);

    public Task<int> GetTotalViewCountAsync(string locale) => _context.Articles.Where(a => a.DeletedAt == null && a.PublishedAt != null && a.PublishedAt <= DateTime.UtcNow && a.Locale == locale).SumAsync(a => a.ViewCount);

    public async Task<ListResult> ListAsync(ArticleFilterOptions filterOptions)
    {
        var query = from a in _context.Articles
                    join u in _context.Users on a.CreatedBy equals u.Id into userJoin
                    from u in userJoin.DefaultIfEmpty()
                    where a.DeletedAt == null && a.Locale == filterOptions.Locale
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
                        a.ScheduledAt,
                        CreatorName = u.Name,
                        CreatorAvatar = u.Avatar,
                        CreatorId = (Guid?)u.Id
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        query = query.OrderByDescending(x => x.CreatedDate);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<ListResult> GetDeletedListAsync(ArticleFilterOptions filterOptions)
    {
        var query = from a in _context.Articles
                    join u in _context.Users on a.CreatedBy equals u.Id into userJoin
                    from u in userJoin.DefaultIfEmpty()
                    where a.DeletedAt != null && a.Locale == filterOptions.Locale
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
                        a.DeletedAt,
                        CreatorName = u.Name,
                        CreatorAvatar = u.Avatar
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        query = query.OrderByDescending(x => x.DeletedAt);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<TResult> GetChartDataAsync(string locale)
    {
        var query = from a in _context.Articles
                    where a.DeletedAt == null && a.PublishedAt != null && a.PublishedAt <= DateTime.UtcNow && a.PublishedAt.Value.Year == DateTime.UtcNow.Year && a.Locale == locale
                    group a by a.PublishedAt!.Value.Month into g
                    orderby g.Key
                    select new
                    {
                        Month = g.Key,
                        Count = g.Count()
                    };
        return TResult.Ok(await query.ToListAsync());
    }

    public async Task<ListResult> GetMostViewedAsync(string locale)
    {
        var query = from a in _context.Articles
                    where a.DeletedAt == null && a.PublishedAt != null && a.PublishedAt <= DateTime.UtcNow && a.Locale == locale
                    orderby a.ViewCount descending
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
        return await ListResult.Success(query, new ArticleFilterOptions { Locale = locale });
    }
}
