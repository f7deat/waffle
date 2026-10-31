using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Articles.Args;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Core.Services.Articles.Models;
using Waffle.Entities;
using Waffle.Models;
using System.Text.Json;

namespace Waffle.Core.Services.Articles;

public class ArticleService(IArticleRepository _articleRepository, IHCAService _hcaService, ILogService _logService) : IArticleService
{
    public Task<TResult> GetByNameAsync(string normalizedName) => _articleRepository.GetByNameAsync(normalizedName);

    public Task<TResult> GetRandomsAsync(string locale) => _articleRepository.GetRandomsAsync(locale);

    public async Task<TResult> GetStatisticsAsync(string locale)
    {
        return TResult.Ok(new
        {
            ViewCount = await _articleRepository.GetTotalViewCountAsync(locale),
            TotalArticles = await _articleRepository.GetTotalArticlesAsync(locale),
            PreviousMonth = await _articleRepository.GetPreviousMonthAsync(locale),
            CurrentMonth = await _articleRepository.GetCurrentMonthAsync(locale)
        });
    }

    public Task<ListResult> ListAsync(ArticleFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _articleRepository.ListAsync(filterOptions);
    }

    public Task<ListResult> GetDeletedListAsync(ArticleFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _articleRepository.GetDeletedListAsync(filterOptions);
    }

    public Task<ListResult> GetPublishedListAsync(ArticleFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _articleRepository.GetPublishedListAsync(filterOptions);
    }

    public Task<TResult> GetFeaturedAsync(string locale) => _articleRepository.GetFeaturedAsync(locale);

    public Task<TResult> GetTrendingAsync(string locale) => _articleRepository.GetTrendingAsync(locale);

    public Task<TResult> GetPublishedCategoriesAsync(string locale) => _articleRepository.GetPublishedCategoriesAsync(locale);

    public Task<TResult> GetTopAuthorsAsync(string locale) => _articleRepository.GetTopAuthorsAsync(locale);

    public async Task<TResult> AddAsync(CreateArticleArgs args, string locale)
    {
        try
        {
            var article = new Article
            {
                Id = Guid.NewGuid(),
                Name = args.Name,
                Description = args.Description,
                Locale = locale,
                NormalizedName = SeoHelper.ToSeoFriendly(args.Name),
                CreatedDate = DateTime.Now,
                CreatedBy = _hcaService.GetUserId()
            };
            await _logService.AddAsync($"Tạo bài viết mới: {article.Name}");
            await _articleRepository.AddAsync(article);
            return TResult.Ok(article.Id);
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> UpdateAsync(UpdateArticleArgs args)
    {
        try
        {
            if (args.Editorial?.ReadingMinutes is < 1 or > 120)
                return TResult.Failed("Reading time must be between 1 and 120 minutes.");

            var article = await _articleRepository.FindWithEditorialDetailAsync(args.Id);
            if (article is null || article.DeletedAt.HasValue) return TResult.Failed("Article not found");
            article.NormalizedName = SeoHelper.ToSeoFriendly(args.Name);
            article.Name = args.Name;
            article.Description = args.Description;
            article.Thumbnail = args.Thumbnail;
            article.Content = args.Content;
            article.CategoryId = args.CategoryId;
            article.IsFeatured = args.IsFeatured;
            if (args.Editorial is not null)
            {
                var editorial = article.EditorialDetail ?? new ArticleEditorialDetail { ArticleId = article.Id };
                editorial.SpotlightLabel = args.Editorial.SpotlightLabel;
                editorial.HeroCaption = args.Editorial.HeroCaption;
                editorial.AuthorName = args.Editorial.AuthorName;
                editorial.AuthorHandle = args.Editorial.AuthorHandle;
                editorial.AuthorTitle = args.Editorial.AuthorTitle;
                editorial.AuthorAvatar = args.Editorial.AuthorAvatar;
                editorial.AuthorBio = args.Editorial.AuthorBio;
                editorial.ReadingMinutes = args.Editorial.ReadingMinutes;
                editorial.TopicsJson = JsonSerializer.Serialize(
                    (args.Editorial.Topics ?? [])
                        .Where(topic => !string.IsNullOrWhiteSpace(topic))
                        .Select(topic => topic.Trim())
                        .Distinct()
                        .ToList());
                editorial.RouteTitle = args.Editorial.RouteTitle;
                editorial.RouteDescription = args.Editorial.RouteDescription;
                editorial.RouteAddress = args.Editorial.RouteAddress;
                editorial.RouteMapUrl = args.Editorial.RouteMapUrl;
                editorial.RouteDownloadUrl = args.Editorial.RouteDownloadUrl;
                editorial.RouteStopsJson = JsonSerializer.Serialize(
                    (args.Editorial.RouteStops ?? [])
                        .Where(stop => !string.IsNullOrWhiteSpace(stop.Name))
                        .ToList());
                article.EditorialDetail = editorial;
            }
            if (args.PublishedAt.HasValue && args.PublishedAt.Value > DateTimeOffset.UtcNow)
            {
                article.PublishedAt = null;
                article.ScheduledAt = args.PublishedAt.Value;
            }
            else
            {
                article.PublishedAt = args.PublishedAt?.UtcDateTime;
                article.ScheduledAt = null;
            }
            article.ModifiedDate = DateTime.Now;
            var result = await _articleRepository.UpdateAsync(article);
            await _articleRepository.SaveChangesAsync();
            return TResult.Ok(result);
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> PublishAsync(Guid id)
    {
        try
        {
            var article = await _articleRepository.FindAsync(id);
            if (article is null || article.DeletedAt.HasValue) return TResult.Failed("Article not found");
            if (article.PublishedAt is not null) return TResult.Ok(article.PublishedAt);

            article.PublishedAt = DateTime.UtcNow;
            article.ScheduledAt = null;
            article.ModifiedDate = DateTime.UtcNow;
            var result = await _articleRepository.UpdateAsync(article);
            await _articleRepository.SaveChangesAsync();
            return TResult.Ok(result);
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        try
        {
            var article = await _articleRepository.FindAsync(id);
            if (article is null || article.DeletedAt.HasValue)
                return TResult.Failed("Article not found");

            article.DeletedAt = DateTime.UtcNow;
            await _articleRepository.UpdateAsync(article);
            return TResult.Ok("Article moved to trash");
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> RestoreAsync(Guid id)
    {
        var article = await _articleRepository.FindAsync(id);
        if (article is null || !article.DeletedAt.HasValue)
            return TResult.Failed("Article not found in trash");

        article.DeletedAt = null;
        await _articleRepository.UpdateAsync(article);
        return TResult.Ok("Article restored successfully");
    }

    public async Task<TResult> DeletePermanentlyAsync(Guid id)
    {
        var article = await _articleRepository.FindAsync(id);
        if (article is null || !article.DeletedAt.HasValue)
            return TResult.Failed("Article not found in trash");

        await _articleRepository.DeleteAsync(article);
        return TResult.Ok("Article deleted permanently");
    }

    public async Task<TResult> GetByIdAsync(Guid id)
    {
        var article = await _articleRepository.FindWithEditorialDetailAsync(id);
        if (article is null || article.DeletedAt.HasValue) return TResult.Failed("Article not found");

        return TResult.Ok(new
        {
            article.Id,
            article.Name,
            article.NormalizedName,
            article.Description,
            article.Thumbnail,
            article.ViewCount,
            article.PublishedAt,
            article.ScheduledAt,
            article.Content,
            article.CategoryId,
            article.IsFeatured,
            Editorial = ToEditorialResponse(article.EditorialDetail),
            article.Locale,
            article.CreatedDate,
            article.ModifiedDate
        });
    }

    private static object? ToEditorialResponse(ArticleEditorialDetail? detail)
    {
        if (detail is null) return null;
        return new
        {
            detail.SpotlightLabel,
            detail.HeroCaption,
            detail.AuthorName,
            detail.AuthorHandle,
            detail.AuthorTitle,
            detail.AuthorAvatar,
            detail.AuthorBio,
            detail.ReadingMinutes,
            Topics = JsonSerializer.Deserialize<List<string>>(detail.TopicsJson),
            detail.RouteTitle,
            detail.RouteDescription,
            detail.RouteAddress,
            detail.RouteMapUrl,
            detail.RouteDownloadUrl,
            RouteStops = JsonSerializer.Deserialize<List<ArticleEditorialStopArgs>>(detail.RouteStopsJson)
        };
    }

    public async Task<TResult> GetMetaAsync(string normalizedName)
    {
        try
        {
            var article = await _articleRepository.FindByNameAsync(normalizedName);
            if (article is null) return TResult.Failed("Article not found");
            return TResult.Ok(new
            {
                article.Id,
                Title = article.Name,
                article.Description,
                Images = string.IsNullOrEmpty(article.Thumbnail) ? null : new[] { article.Thumbnail }
            });
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public Task<TResult> GetChartDataAsync(string locale) => _articleRepository.GetChartDataAsync(locale);

    public Task<ListResult> GetMostViewedAsync(string locale) => _articleRepository.GetMostViewedAsync(locale);

    public Task<ArticleScheduleResponse> GetScheduleAsync(
        ArticleScheduleFilterOptions filterOptions,
        CancellationToken cancellationToken) =>
        _articleRepository.GetScheduleAsync(filterOptions, cancellationToken);

    public async Task<ScheduleArticleResponse?> ScheduleAsync(
        Guid id,
        DateTimeOffset? scheduledAt,
        CancellationToken cancellationToken)
    {
        if (scheduledAt.HasValue && scheduledAt.Value <= DateTimeOffset.UtcNow)
            throw new InvalidArticleScheduleException();
        return await _articleRepository.ScheduleArticleAsync(id, scheduledAt, DateTimeOffset.UtcNow, cancellationToken);
    }

    public Task<int> PublishScheduledArticlesAsync(CancellationToken cancellationToken) =>
        _articleRepository.PublishScheduledArticlesAsync(DateTimeOffset.UtcNow, cancellationToken);
}
