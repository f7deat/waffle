using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Core.Services.Ecommerces;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }
}
