using Microsoft.AspNetCore.Identity;
using Waffle.Entities.Ecommerces;

namespace Waffle.Core.Interfaces.IService;

public interface IProductService
{
    Task<IdentityResult> SaveAsync(Product args);
    Task<int> CountAsync();
    Task<Product?> GetByCatalogIdAsync(Guid catalogId);
}
