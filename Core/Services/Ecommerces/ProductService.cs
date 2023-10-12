using Microsoft.AspNetCore.Identity;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels.Products;

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

    public Task<List<ProductListItem>> ListAsync(IFilterOptions filterOptions)
    {
        return _productRepository.ListAsync(filterOptions);
    }

    public Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _productRepository.ListByTagAsync(tagId, filterOptions);
    }

    public Task<IEnumerable<ProductListItem>> ListRelatedAsync(IEnumerable<Guid> tagIds, Guid currentCatalogId) => _productRepository.ListRelatedAsync(tagIds, currentCatalogId);

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

    public Task<IdentityResult> SaveBrandAsync(SaveBrandModel args) => _productRepository.SaveBrandAsync(args);
}
