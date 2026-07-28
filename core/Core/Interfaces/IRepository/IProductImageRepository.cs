using Waffle.Core.Foundations.Interfaces;
using Waffle.Entities.Ecommerces;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProductImageRepository : IAsyncRepository<ProductImage>
{
    Task<IEnumerable<ProductImage>> ListByProductIdAsync(Guid productId);
    Task SyncAsync(Guid productId, IEnumerable<ProductImage> images);
}