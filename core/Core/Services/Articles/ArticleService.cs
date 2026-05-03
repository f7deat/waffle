using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Articles.Args;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services.Articles;

public class ArticleService(IArticleRepository _articleRepository) : IArticleService
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

    public async Task<TResult> AddAsync(CreateArticleArgs args, string locale)
    {
        try
        {
            var article = new Article
            {
                Name = args.Name,
                Description = args.Description,
                Locale = locale,
                NormalizedName = SeoHelper.ToSeoFriendly(args.Name)
            };
            var result = await _articleRepository.AddAsync(article);
            await _articleRepository.SaveChangesAsync();
            return TResult.Ok(result.Id);
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
            var article = new Article
            {
                Id = args.Id,
                Name = args.Name,
                Description = args.Description
            };
            article.NormalizedName = SeoHelper.ToSeoFriendly(article.Name);
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
            if (article is null)
                return TResult.Failed("Article not found");

            await _articleRepository.DeleteAsync(article);
            await _articleRepository.SaveChangesAsync();
            return TResult.Ok("Article deleted successfully");
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> GetByIdAsync(Guid id)
    {
        var article = await _articleRepository.FindAsync(id);
        if (article is null)
            return TResult.Failed("Article not found");

        return TResult.Ok(new
        {
            article.Id,
            article.Name,
            article.NormalizedName,
            article.Description,
            article.Thumbnail,
            article.ViewCount,
            article.PublishedAt,
            article.Content,
            article.Locale,
            article.CreatedDate,
            article.ModifiedDate
        });
    }
}
