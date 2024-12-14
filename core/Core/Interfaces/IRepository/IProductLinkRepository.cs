using Waffle.Entities.Ecommerces;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductLinkRepository : IAsyncRepository<ProductLink>
{
    Task<IEnumerable<ProductLink>> ListByProductIdAsync(Guid productId);
}
