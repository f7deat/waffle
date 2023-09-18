using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Ecommerces;

namespace Waffle.Core.Services.Ecommerces;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICurrentUser _currentUser;

    public ProductService(IProductRepository productRepository, ICurrentUser currentUser)
    {
        _productRepository = productRepository;
        _currentUser = currentUser;
    }

    public async Task<IdentityResult> SaveAsync(Product args)
    {
        var product = await _productRepository.FindByCatalogAsync(args.CatalogId);
        if (product is null)
        {
            product = new Product
            {
                CatalogId = args.CatalogId,
                Price = args.Price,
                SKU = args.SKU,
                UnitInStock = args.UnitInStock
            };
            await _productRepository.AddAsync(product);

        }
        else
        {
            product.Price = args.Price;
            product.SKU = args.SKU;
            product.UnitInStock = args.UnitInStock;
            await _productRepository.SaveChangesAsync();
        }
        return IdentityResult.Success;
    }
}
