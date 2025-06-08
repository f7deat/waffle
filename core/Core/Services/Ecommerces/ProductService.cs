using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.Result;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Services.Ecommerces;

public class ProductService(IProductRepository productRepository, ICatalogRepository catalogRepository, IProductLinkRepository productLinkRepository) : IProductService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly ICatalogRepository _catalogRepository = catalogRepository;
    private readonly IProductLinkRepository _productLinkRepository = productLinkRepository;

    public async Task<DefResult> AddLinkAsync(ProductLink args)
    {
        var product = await _productRepository.FindAsync(args.ProductId);
        if (product is null) return DefResult.Failed("Product not found!");
        var catalog = await _catalogRepository.FindAsync(product.CatalogId);
        if (catalog is null) return DefResult.Failed("Catalog not found!");
        catalog.ModifiedDate = DateTime.Now;
        await _productLinkRepository.AddAsync(new ProductLink
        {
            CreatedDate = DateTime.Now,
            ProductId = args.ProductId,
            Name = args.Name,
            Url = args.Url
        });
        return DefResult.Success;
    }

    public Task<int> CountAsync() => _catalogRepository.CountAsync(CatalogType.Product);

    public Task<DefResult> CreateAsync(Catalog args, string locale) => _productRepository.CreateAsync(args, locale);

    public async Task<DefResult> DeleteLinkAsync(Guid id)
    {
        var productLink = await _productLinkRepository.FindAsync(id);
        if (productLink is null) return DefResult.Failed("Product link not found!");
        await _productLinkRepository.DeleteAsync(productLink);
        return DefResult.Success;
    }

    public async Task<Product?> GetByCatalogIdAsync(Guid catalogId) => await _productRepository.FindByCatalogAsync(catalogId);

    public Task<IEnumerable<ProductLink>> GetLinksAsync(Guid productId)
    {
        return _productLinkRepository.ListByProductIdAsync(productId);
    }

    public async Task<DefResult> GoToProductLinkAsync(Guid id)
    {
        var productLink = await _productLinkRepository.FindAsync(id);
        if (productLink is null) return DefResult.Failed("Product link not found!");
        productLink.ClickCount++;
        await _productLinkRepository.UpdateAsync(productLink);
        return DefResult.Success;
    }

    public Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _productRepository.ListAsync(filterOptions);
    }

    public Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _productRepository.ListByTagAsync(tagId, filterOptions);
    }

    public Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData) => _productRepository.ListRelatedAsync(pageData);

    public Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale) => _productRepository.ListSpotlightAsync(pageSize, tagIds, locale);

    public Task<ListResult<object>> NewArrivalsAsync(ProductFilterOptions filterOptions) => _productRepository.NewArrivalsAsync(filterOptions);

    public Task<object> OptionsAsync() => _productRepository.OptionsAsync();

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
                SalePrice = args.SalePrice,
                AffiliateLink = args.AffiliateLink
            };
            await _productRepository.AddAsync(product);

        }
        else
        {
            product.Price = args.Price;
            product.SKU = args.SKU;
            product.UnitInStock = args.UnitInStock;
            product.SalePrice = args.SalePrice;
            product.AffiliateLink = args.AffiliateLink;
            await _productRepository.SaveChangesAsync();
        }
        return IdentityResult.Success;
    }

    public Task<IdentityResult> SaveBrandAsync(SaveBrandModel args) => _productRepository.SaveBrandAsync(args);
}
