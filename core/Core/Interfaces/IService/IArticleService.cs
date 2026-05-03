using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IArticleService
{
    Task<TResult> GetByNameAsync(string normalizedName);
    Task<TResult> GetRandomsAsync(string locale);
    Task<TResult> GetStatisticsAsync(string locale);
    Task<ListResult> ListAsync(ArticleFilterOptions filterOptions);
    Task<TResult> AddAsync(Article article);
    Task<TResult> UpdateAsync(Article article);
    Task<TResult> DeleteAsync(Guid id);
    Task<TResult> GetByIdAsync(Guid id);
}
