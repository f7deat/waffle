using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Entities.Settings;
using Waffle.Core.Services.Shop.Filters;
using Waffle.Models;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Infrastructure.Repositories;

public class ProductRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Product>(context, hcaService), IProductRepository
{
    public async Task<bool> AnyAsync(Guid productId) => await _context.Products.AnyAsync(x => x.Id == productId);

    public async Task<ListResult<ProductCategoryListItem>> ListCategoriesAsync(ProductCategoryFilterOptions filterOptions)
    {
        var query = from category in _context.Categories
                    where category.Type == CategoryType.Product && !category.DeletedAt.HasValue
                    join product in _context.Products on category.Id equals product.CategoryId into productGroup
                    let productCount = productGroup.Count(x => string.IsNullOrEmpty(filterOptions.Locale) || x.Locale == filterOptions.Locale)
                    where productCount > 0
                    select new ProductCategoryListItem
                    {
                        Id = category.Id,
                        Name = category.Name,
                        NormalizedName = category.NormalizedName ?? string.Empty,
                        Description = category.Description,
                        ProductCount = productCount,
                        Thumbnail = productGroup
                            .Where(x => string.IsNullOrEmpty(filterOptions.Locale) || x.Locale == filterOptions.Locale)
                            .OrderByDescending(x => x.ModifiedDate ?? x.CreatedDate)
                            .Select(x => x.Thumbnail)
                            .FirstOrDefault()
                    };

        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }

        query = query.OrderBy(x => x.Name);
        return await ListResult<ProductCategoryListItem>.Success(query, filterOptions);
    }

    public Task<bool> CategoryExistsAsync(int categoryId) => _context.Categories.AnyAsync(x => x.Id == categoryId);
    public Task<bool> BrandExistsAsync(int brandId) => _context.Brands.AnyAsync(x => x.Id == brandId);

    public async Task<TResult> CreateAsync(Product args, string locale)
    {
        var normalizedName = SeoHelper.ToSeoFriendly(args.Name);
        if (await _context.Products.AnyAsync(x => x.NormalizedName == normalizedName && x.Locale == locale))
        {
            return TResult.Failed("Product with the same name already exists!");
        }
        if (args.CategoryId.HasValue && !await CategoryExistsAsync(args.CategoryId.Value)) return TResult.Failed("Category does not exist!");
        await _context.Products.AddAsync(new Product
        {
            Name = args.Name,
            Description = args.Description,
            Locale = locale,
            NormalizedName = normalizedName,
            CreatedDate = DateTime.Now,
            CreatedBy = _hcaService.GetUserId()
        });
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product is null)
        {
            return TResult.Failed("Product not found!");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<Product?> DetailAsync(Guid id) => await _context.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var query = from p in _context.Products
                    where p.NormalizedName == normalizedName
                    select p;
        var product = await query.FirstOrDefaultAsync();
        if (product is null) return TResult.Failed("Product not found!");
        product.ViewCount++;
        await _context.SaveChangesAsync();
        var variants = await _context.ProductVariants
            .Where(x => x.ProductId == product.Id)
            .OrderBy(x => x.SortOrder)
            .Select(x => new
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
            .ToListAsync();
        var images = await _context.ProductImages
            .Where(x => x.ProductId == product.Id)
            .OrderBy(x => x.SortOrder)
            .Select(x => new
            {
                x.Id,
                x.ProductId,
                x.Url,
                x.SortOrder
            })
            .ToListAsync();
        var tagIds = await _context.ProductTags
            .Where(x => x.ProductId == product.Id)
            .Select(x => x.TagId)
            .ToListAsync();
        
        var category = product.CategoryId.HasValue ? await _context.Categories.FindAsync(product.CategoryId) : null;
        var brand = product.BrandId.HasValue
            ? await _context.Brands
                .Where(x => x.Id == product.BrandId && x.IsActive && !x.DeletedAt.HasValue)
                .Select(x => new { x.Id, x.Name, x.NormalizedName })
                .FirstOrDefaultAsync()
            : null;

        return TResult.Ok(new
        {
            product.Id,
            product.Name,
            product.NormalizedName,
            product.Thumbnail,
            product.CreatedDate,
            product.ModifiedDate,
            product.ViewCount,
            product.Price,
            product.SalePrice,
            product.Description,
            product.SKU,
            Content = JsonSerializer.Deserialize<object>(product.Content ?? "{}"),
            product.UnitInStock,
            product.AffiliateLink,
            TagIds = tagIds,
            Variants = variants,
            Images = images,
            product.CategoryId,
            product.BrandId,
            brand = brand,
            category = new
            {
                category?.Id,
                category?.Name,
                category?.NormalizedName
            }
        });
    }

    public async Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions)
    {
        var query = ProductListQuery(filterOptions);
        query = SortProducts(query, filterOptions.SortBy);
        return await ListResult<ProductListItem>.Success(query, filterOptions);
    }

    public async Task<IEnumerable<ProductListItem>> ExportAsync(ProductFilterOptions filterOptions)
    {
        var query = ProductListQuery(filterOptions)
            .OrderByDescending(x => x.ModifiedDate);
        return await query.ToListAsync();
    }

    private IQueryable<ProductListItem> ProductListQuery(ProductFilterOptions filterOptions)
    {
        var query = from product in _context.Products
                    join category in _context.Categories on product.CategoryId equals category.Id into categoryGroup
                    from category in categoryGroup.DefaultIfEmpty()
                    select new ProductListItem
                    {
                        Id = product.Id,
                        Name = product.Name,
                        NormalizedName = product.NormalizedName,
                        Thumbnail = product.Thumbnail,
                        ViewCount = product.ViewCount,
                        Price = product.Price,
                        SalePrice = product.SalePrice,
                        UnitInStock = product.UnitInStock,
                        Description = product.Description,
                        Type = CatalogType.Product,
                        ModifiedDate = product.ModifiedDate ?? product.CreatedDate,
                        Locale = product.Locale,
                        CategoryId = product.CategoryId,
                        BrandId = product.BrandId,
                        CategoryName = category.Name,
                        CreatedDate = product.CreatedDate,
                    };
        return ApplyProductFilters(query, filterOptions);
    }

    public async Task<ListResult<ProductListItem>> ListByCategoryAsync(string normalizedName, ProductFilterOptions filterOptions)
    {
        normalizedName = SeoHelper.ToSeoFriendly(normalizedName);
        var query = from product in _context.Products
                    join category in _context.Categories on product.CategoryId equals category.Id into categoryGroup
                    from category in categoryGroup.DefaultIfEmpty()
                    where category != null && !category.DeletedAt.HasValue && category.NormalizedName == normalizedName
                    select new ProductListItem
                    {
                        Id = product.Id,
                        Name = product.Name,
                        NormalizedName = product.NormalizedName,
                        Thumbnail = product.Thumbnail,
                        ViewCount = product.ViewCount,
                        Price = product.Price,
                        SalePrice = product.SalePrice,
                        UnitInStock = product.UnitInStock,
                        Description = product.Description,
                        Type = CatalogType.Product,
                        ModifiedDate = product.ModifiedDate ?? product.CreatedDate,
                        Locale = product.Locale,
                        CategoryId = product.CategoryId,
                        BrandId = product.BrandId,
                        CategoryName = category.Name,
                        CreatedDate = product.CreatedDate
                    };

        query = ApplyProductFilters(query, filterOptions);
        query = SortProducts(query, filterOptions.SortBy);
        return await ListResult<ProductListItem>.Success(query, filterOptions);
    }

    private static IQueryable<ProductListItem> ApplyProductFilters(
        IQueryable<ProductListItem> query,
        ProductFilterOptions filterOptions)
    {
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        if (!string.IsNullOrEmpty(filterOptions.Locale))
        {
            query = query.Where(x => x.Locale == filterOptions.Locale);
        }
        if (filterOptions.CategoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == filterOptions.CategoryId);
        }
        if (filterOptions.BrandId.HasValue)
        {
            query = query.Where(x => x.BrandId == filterOptions.BrandId);
        }
        if (filterOptions.MinPrice.HasValue)
        {
            query = query.Where(x => (x.SalePrice ?? x.Price) >= filterOptions.MinPrice.Value);
        }
        if (filterOptions.MaxPrice.HasValue)
        {
            query = query.Where(x => (x.SalePrice ?? x.Price) <= filterOptions.MaxPrice.Value);
        }
        if (filterOptions.OnSale == true)
        {
            query = query.Where(x => x.SalePrice.HasValue && x.Price.HasValue && x.SalePrice < x.Price);
        }
        if (filterOptions.InStock == true)
        {
            query = query.Where(x => x.UnitInStock > 0);
        }
        return query;
    }

    private static IQueryable<ProductListItem> SortProducts(IQueryable<ProductListItem> query, string? sortBy) =>
        sortBy switch
        {
            "popular" => query.OrderByDescending(x => x.ViewCount).ThenByDescending(x => x.ModifiedDate),
            "price-asc" => query.OrderBy(x => x.SalePrice ?? x.Price).ThenByDescending(x => x.ModifiedDate),
            "price-desc" => query.OrderByDescending(x => x.SalePrice ?? x.Price).ThenByDescending(x => x.ModifiedDate),
            _ => query.OrderByDescending(x => x.ModifiedDate)
        };

    public async Task<ListResult<ProductListItem>> ListProductsByTagAsync(ProductTagFilterOptions filterOptions)
    {
        var query = from product in _context.Products
                    join productTag in _context.ProductTags on product.Id equals productTag.ProductId
                    join tag in _context.Tags on productTag.TagId equals tag.Id
                    join category in _context.Categories on product.CategoryId equals category.Id into categoryGroup
                    from category in categoryGroup.DefaultIfEmpty()
                    where tag.NormalizedName == filterOptions.TagName
                    select new ProductListItem
                    {
                        Id = product.Id,
                        Name = product.Name,
                        NormalizedName = product.NormalizedName,
                        Thumbnail = product.Thumbnail,
                        ViewCount = product.ViewCount,
                        Price = product.Price,
                        SalePrice = product.SalePrice,
                        Description = product.Description,
                        Type = CatalogType.Product,
                        ModifiedDate = product.ModifiedDate ?? product.CreatedDate,
                        Locale = product.Locale,
                        CategoryId = product.CategoryId,
                        CategoryName = category.Name,
                        CreatedDate = product.CreatedDate
                    };

        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        if (!string.IsNullOrEmpty(filterOptions.Locale))
        {
            query = query.Where(x => x.Locale == filterOptions.Locale);
        }

        query = query.OrderByDescending(x => x.ModifiedDate);
        return await ListResult<ProductListItem>.Success(query, filterOptions);
    }

    public async Task<IEnumerable<ProductListItem>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions)
    {
        var query = from product in _context.Products
                    orderby product.ModifiedDate descending
                    select new ProductListItem
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Thumbnail = product.Thumbnail,
                        Price = product.Price,
                        SalePrice = product.SalePrice,
                        Category = product.NormalizedName
                    };
        return await query.OrderBy(x => Guid.NewGuid()).Take(4).ToListAsync();
    }

    public async Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData)
    {
        var query = (from product in _context.Products
                     select new ProductListItem
                     {
                         Id = product.Id,
                         Name = product.Name,
                         Thumbnail = product.Thumbnail,
                         Price = product.Price,
                         SalePrice = product.SalePrice,
                     }).Distinct().OrderByDescending(x => Guid.NewGuid());
        return await query.Take(4).ToListAsync();
    }

    public async Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale)
    {
        var query = from product in _context.Products
                    select new ProductListItem
                    {
                        Name = product.Name,
                        Id = product.Id,
                        NormalizedName = product.NormalizedName,
                        Price = product.Price,
                        SalePrice = product.SalePrice,
                        Thumbnail = product.Thumbnail,
                        ViewCount = product.ViewCount,
                        ModifiedDate = product.ModifiedDate ?? product.CreatedDate,
                    };
        return await query.Distinct().OrderBy(x => Guid.NewGuid()).Take(pageSize).AsNoTracking().ToListAsync();
    }

    public async Task<ListResult<object>> NewArrivalsAsync(ProductFilterOptions filterOptions)
    {
        var query = from a in _context.Products
                    orderby a.ModifiedDate descending
                    select new
                    {
                        id = a.Id,
                        name = a.Name,
                        normalizedName = a.NormalizedName,
                        thumbnail = a.Thumbnail,
                        price = a.Price,
                        salePrice = a.SalePrice,
                        description = a.Description,
                        modifiedDate = a.ModifiedDate
                    };
        return await ListResult<object>.Success(query, filterOptions);
    }

    public async Task<object> OptionsAsync(SelectOptions selectOptions)
    {
        var query = from p in _context.Products
                    select new
                    {
                        p.Name,
                        p.Id
                    };
        if (!string.IsNullOrWhiteSpace(selectOptions.KeyWords))
        {
            query = query.Where(x => x.Name.ToLower().Contains(selectOptions.KeyWords.ToLower()));
        }
        return await query.Select(x => new { label = x.Name, value = x.Id }).ToListAsync();
    }

}
