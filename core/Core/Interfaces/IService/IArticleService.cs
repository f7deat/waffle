using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IArticleService
{
    Task<TResult> GetByNameAsync(string normalizedName);
    Task<ListResult> ListAsync(ArticleFilterOptions filterOptions);
}
