using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;

namespace Waffle.Core.Services.Ecommerces;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICatalogRepository _catalogRepository;

    public ProductService(IProductRepository productRepository, ICatalogRepository catalogRepository)
    {
        _productRepository = productRepository;
        _catalogRepository = catalogRepository;
    }

    public Task<int> CountAsync() => _catalogRepository.CountAsync(CatalogType.Product);

    public async Task<Product?> GetByCatalogIdAsync(Guid catalogId) => await _productRepository.FindByCatalogAsync(catalogId);

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
                UnitInStock = args.UnitInStock,
                SalePrice = args.SalePrice
            };
            await _productRepository.AddAsync(product);

        }
        else
        {
            product.Price = args.Price;
            product.SKU = args.SKU;
            product.UnitInStock = args.UnitInStock;
            product.SalePrice = args.SalePrice;
            await _productRepository.SaveChangesAsync();
        }
        return IdentityResult.Success;
    }
}
