using Waffle.Core.Foundations.Interfaces;
using Waffle.Entities.Ecommerces;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductVariantRepository : IAsyncRepository<ProductVariant>
{
    Task<IEnumerable<ProductVariant>> ListByProductIdAsync(Guid productId);
    Task SyncAsync(Guid productId, IEnumerable<ProductVariant> variants);
}