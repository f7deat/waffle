using ClosedXML.Excel;
using System.Text.Json;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IServices.Shops;
using Waffle.Core.Services.Shop.Filters;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Core.Services.Shop;

public class ProductService(IProductRepository _productRepository, IProductLinkRepository _productLinkRepository, ILogService _logService, IProductVariantRepository _productVariantRepository, IProductTagRepository _productTagRepository, IProductImageRepository _productImageRepository) : IProductService
{
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

    public Task<ListResult<ProductCategoryListItem>> ListCategoriesAsync(ProductCategoryFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _productRepository.ListCategoriesAsync(filterOptions);
    }

    public Task<TResult> CreateAsync(Product args, string locale) => _productRepository.CreateAsync(args, locale);

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
        var images = (await _productImageRepository.ListByProductIdAsync(id)).ToList();
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
            }),
            Images = images.Select(x => new
            {
                x.Id,
                x.ProductId,
                x.Url,
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

    public async Task<IEnumerable<ProductImage>> GetImagesAsync(Guid productId)
    {
        if (!await _productRepository.AnyAsync(productId)) return [];
        return await _productImageRepository.ListByProductIdAsync(productId);
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

    public async Task<byte[]> ExportAsync(ProductFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        var products = await _productRepository.ExportAsync(filterOptions);

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Products");
        worksheet.Cell(1, 1).Value = "Tên sản phẩm";
        worksheet.Cell(1, 2).Value = "Danh mục";
        worksheet.Cell(1, 3).Value = "Giá";
        worksheet.Cell(1, 4).Value = "Giá khuyến mãi";
        worksheet.Cell(1, 5).Value = "Lượt xem";
        worksheet.Cell(1, 6).Value = "Locale";
        worksheet.Cell(1, 7).Value = "Cập nhật";

        var row = 2;
        foreach (var product in products)
        {
            worksheet.Cell(row, 1).Value = product.Name ?? string.Empty;
            worksheet.Cell(row, 2).Value = product.CategoryName ?? string.Empty;
            worksheet.Cell(row, 3).Value = product.Price ?? 0;
            worksheet.Cell(row, 4).Value = product.SalePrice ?? 0;
            worksheet.Cell(row, 5).Value = product.ViewCount;
            worksheet.Cell(row, 6).Value = product.Locale ?? string.Empty;
            worksheet.Cell(row, 7).Value = product.ModifiedDate;
            row++;
        }

        var header = worksheet.Range(1, 1, 1, 7);
        header.Style.Font.Bold = true;
        header.Style.Fill.BackgroundColor = XLColor.LightBlue;
        worksheet.Columns(3, 4).Style.NumberFormat.Format = "#,##0.00";
        worksheet.Column(7).Style.DateFormat.Format = "yyyy-mm-dd hh:mm";
        worksheet.Columns().AdjustToContents();
        worksheet.Column(1).Width = Math.Min(worksheet.Column(1).Width, 50);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public Task<ListResult<ProductListItem>> ListByCategoryAsync(string normalizedName, ProductFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _productRepository.ListByCategoryAsync(normalizedName, filterOptions);
    }

    public Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _productRepository.ListByTagAsync(tagId, filterOptions);
    }

    public Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData) => _productRepository.ListRelatedAsync(pageData);

    public Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale) => _productRepository.ListSpotlightAsync(pageSize, tagIds, locale);

    public Task<ListResult<object>> NewArrivalsAsync(ProductFilterOptions filterOptions) => _productRepository.NewArrivalsAsync(filterOptions);

    public async Task<object> OptionsAsync(SelectOptions selectOptions)
    {
        try
        {
            return await _productRepository.OptionsAsync(selectOptions);
        }
        catch (Exception ex)
        {
            await _logService.ExceptionAsync(ex);
            throw;
        }
    }

    public async Task<TResult> SaveAsync(Product args)
    {
        var product = await _productRepository.FindAsync(args.Id);
        if (product is null) return TResult.Failed("Product not found!");
        if (args.CategoryId.HasValue && !await _productRepository.CategoryExistsAsync(args.CategoryId.Value)) return TResult.Failed("Category not found!");
        product.Price = args.Price;
        product.SKU = args.SKU;
        product.UnitInStock = args.UnitInStock;
        product.SalePrice = args.SalePrice;
        product.AffiliateLink = args.AffiliateLink;
        product.Content = args.Content;
        product.Name = args.Name;
        product.Description = args.Description;
        product.Thumbnail = args.Thumbnail;
        product.CategoryId = args.CategoryId;
        product.NormalizedName = SeoHelper.ToSeoFriendly(args.Name);

        if (args.Variants is not null)
        {
            await _productVariantRepository.SyncAsync(args.Id, args.Variants);
        }
        if (args.Images is not null)
        {
            await _productImageRepository.SyncAsync(args.Id, args.Images);
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

    public async Task<TResult> SaveImagesAsync(Guid productId, IEnumerable<ProductImage> images)
    {
        if (!await _productRepository.AnyAsync(productId)) return TResult.Failed("Product not found!");
        await _productImageRepository.SyncAsync(productId, images);
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

    public Task<ListResult> ListProductsByTagAsync(ProductTagFilterOptions filterOptions)
    {
        throw new NotImplementedException();
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
