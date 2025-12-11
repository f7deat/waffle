using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Core.Services.Articles;

public class ArticleService(IArticleRepository _articleRepository) : IArticleService
{
    public Task<TResult> GetByNameAsync(string normalizedName) => _articleRepository.GetByNameAsync(normalizedName);
}
