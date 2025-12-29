using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Articles.Filters;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IArticleRepository : IAsyncRepository<Catalog>
{
    Task<TResult> GetByNameAsync(string normalizedName);
    Task<ListResult> ListAsync(ArticleFilterOptions filterOptions);
}
