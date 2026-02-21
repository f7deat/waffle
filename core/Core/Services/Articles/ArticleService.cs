using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Articles.Filters;
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
}
