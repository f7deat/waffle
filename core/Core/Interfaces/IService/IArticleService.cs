
using Waffle.Core.Foundations.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IArticleService
{
    Task<TResult> GetByNameAsync(string normalizedName);
}
