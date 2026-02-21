using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IArticleRepository : IAsyncRepository<Catalog>
{
    Task<TResult> GetByNameAsync(string normalizedName);
    Task<int> GetCurrentMonthAsync(string locale);
    Task<int> GetPreviousMonthAsync(string locale);
    Task<TResult> GetRandomsAsync(string locale);
    Task<int> GetTotalArticlesAsync(string locale);
    Task<int> GetTotalViewCountAsync(string locale);
    Task<ListResult> ListAsync(ArticleFilterOptions filterOptions);
}
