using Waffle.Core.Foundations.Interfaces;
using Waffle.Entities.Ecommerces;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductTagRepository : IAsyncRepository<ProductTag>
{
    Task<IEnumerable<ProductTag>> ListByProductIdAsync(Guid productId);
    Task SyncAsync(Guid productId, IEnumerable<Guid> tagIds);
}