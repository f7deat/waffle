using System.Text.Json;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.Shops;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Services.Shop;

public class ProductService(IProductRepository productRepository, IProductLinkRepository productLinkRepository, IProductVariantRepository productVariantRepository, IProductTagRepository productTagRepository) : IProductService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IProductLinkRepository _productLinkRepository = productLinkRepository;
    private readonly IProductVariantRepository _productVariantRepository = productVariantRepository;
    private readonly IProductTagRepository _productTagRepository = productTagRepository;

    public async Task<TResult> AddLinkAsync(ProductLink args)
    {
        var product = await _productRepository.FindAsync(args.ProductId);
        if (product is null) return TResult.Failed("Product not found!");
        await _productLinkRepository.AddAsync(new ProductLink
        {
            CreatedDate = DateTime.Now,
            ProductId = args.ProductId,
            Name = args.Name,
            Url = args.Url
        });
        return TResult.Success;
    }

    public Task<int> CountAsync() => _productRepository.CountAsync();

    public Task<TResult> CreateAsync(Product args) => _productRepository.CreateAsync(args);

    public Task<TResult> DeleteAsync(Guid id) => _productRepository.DeleteAsync(id);

    public async Task<TResult> DetailAsync(Guid id)
    {
        var product = await _productRepository.DetailAsync(id);
        if (product is null) return TResult.Failed("Product not found!");

        var variants = (await _productVariantRepository.ListByProductIdAsync(id)).ToList();
        if (variants.Count == 0)
        {
            variants = GetLegacyVariants(product.Content, id).ToList();
        }
        var tags = (await _productTagRepository.ListByProductIdAsync(id)).ToList();

        return TResult.Ok(new
        {
            product.Id,
            product.Name,
            product.Description,
            product.Thumbnail,
            product.Price,
            product.SalePrice,
            product.SKU,
            product.UnitInStock,
            product.AffiliateLink,
            Content = JsonSerializer.Deserialize<object>(product.Content ?? "{}"),
            product.NormalizedName,
            product.CategoryId,
            product.CreatedDate,
            product.ModifiedDate,
            TagIds = tags.Select(x => x.TagId),
            Tags = tags.Select(x => new
            {
                Id = x.TagId,
                x.Tag?.Name,
                x.Tag?.NormalizedName
            }),
            Variants = variants.Select(x => new
            {
                x.Id,
                x.ProductId,
                x.Name,
                x.SKU,
                x.Price,
                x.SalePrice,
                x.UnitInStock,
                x.Thumbnail,
                x.SortOrder
            })
        });
    }

    public async Task<TResult> DeleteLinkAsync(Guid id)
    {
        var productLink = await _productLinkRepository.FindAsync(id);
        if (productLink is null) return TResult.Failed("Product link not found!");
        await _productLinkRepository.DeleteAsync(productLink);
        return TResult.Success;
    }

    public Task<TResult> GetByNameAsync(string normalizedName) => _productRepository.GetByNameAsync(normalizedName);

    public async Task<IEnumerable<object>> GetTagsAsync(Guid productId)
    {
        if (!await _productRepository.AnyAsync(productId)) return [];
        return (await _productTagRepository.ListByProductIdAsync(productId)).Select(x => new
        {
            Id = x.TagId,
            x.Tag?.Name,
            x.Tag?.NormalizedName
        });
    }

    public async Task<IEnumerable<ProductVariant>> GetVariantsAsync(Guid productId)
    {
        if (!await _productRepository.AnyAsync(productId)) return [];

        var variants = (await _productVariantRepository.ListByProductIdAsync(productId)).ToList();
        if (variants.Count > 0) return variants;

        var product = await _productRepository.DetailAsync(productId);
        return product is null ? [] : GetLegacyVariants(product.Content, productId);
    }

    public Task<IEnumerable<ProductLink>> GetLinksAsync(Guid productId)
    {
        return _productLinkRepository.ListByProductIdAsync(productId);
    }

    public async Task<TResult> GoToProductLinkAsync(Guid id)
    {
        var productLink = await _productLinkRepository.FindAsync(id);
        if (productLink is null) return TResult.Failed("Product link not found!");
        productLink.ClickCount++;
        await _productLinkRepository.UpdateAsync(productLink);
        return TResult.Success;
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

    public Task<object> OptionsAsync(SelectOptions selectOptions) => _productRepository.OptionsAsync(selectOptions);

    public async Task<TResult> SaveAsync(Product args)
    {
        var product = await _productRepository.FindAsync(args.Id);
        if (product is null) return TResult.Failed("Product not found!");
        product.Price = args.Price;
        product.SKU = args.SKU;
        product.UnitInStock = args.UnitInStock;
        product.SalePrice = args.SalePrice;
        product.AffiliateLink = args.AffiliateLink;
        product.Content = args.Content;
        product.Name = args.Name;
        product.Description = args.Description;
        product.Thumbnail = args.Thumbnail;
        product.NormalizedName = SeoHelper.ToSeoFriendly(args.Name);

        if (args.Variants is not null)
        {
            await _productVariantRepository.SyncAsync(args.Id, args.Variants);
        }
        if (args.TagIds is not null)
        {
            await _productTagRepository.SyncAsync(args.Id, args.TagIds);
        }

        await _productRepository.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> SaveVariantsAsync(Guid productId, IEnumerable<ProductVariant> variants)
    {
        if (!await _productRepository.AnyAsync(productId)) return TResult.Failed("Product not found!");
        await _productVariantRepository.SyncAsync(productId, variants);
        return TResult.Success;
    }

    public async Task<TResult> SaveTagsAsync(Guid productId, IEnumerable<Guid> tagIds)
    {
        if (!await _productRepository.AnyAsync(productId)) return TResult.Failed("Product not found!");
        await _productTagRepository.SyncAsync(productId, tagIds);
        return TResult.Success;
    }

    private static IEnumerable<ProductVariant> GetLegacyVariants(string? content, Guid productId)
    {
        if (string.IsNullOrWhiteSpace(content)) return [];
        try
        {
            var parsed = JsonSerializer.Deserialize<LegacyProductContent>(content);
            if (parsed?.Variants is null || parsed.Variants.Count == 0) return [];
            return parsed.Variants.Select((x, index) => new ProductVariant
            {
                ProductId = productId,
                Name = x.Name,
                SKU = x.SKU,
                Price = x.Price,
                SalePrice = x.SalePrice,
                UnitInStock = x.UnitInStock,
                Thumbnail = x.Thumbnail,
                SortOrder = index
            }).ToList();
        }
        catch
        {
            return [];
        }
    }

    private class LegacyProductContent
    {
        public List<LegacyProductVariant> Variants { get; set; } = [];
    }

    private class LegacyProductVariant
    {
        public string? Name { get; set; }
        public string? SKU { get; set; }
        public decimal? Price { get; set; }
        public decimal? SalePrice { get; set; }
        public int? UnitInStock { get; set; }
        public string? Thumbnail { get; set; }
    }

}
