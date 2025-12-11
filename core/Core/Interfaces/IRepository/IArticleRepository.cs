using Waffle.Core.Foundations.Models;
using Waffle.Entities;

namespace Waffle.Core.Interfaces.IRepository;

public interface IArticleRepository : IAsyncRepository<Catalog>
{
    Task<TResult> GetByNameAsync(string normalizedName);
}
