using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Infrastructure.Repositories;

public class ProductRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Product>(context, hcaService), IProductRepository
{
    public async Task<bool> AnyAsync(Guid productId) => await _context.Products.AnyAsync(x => x.Id == productId);

    public async Task<TResult> CreateAsync(Catalog args, string locale)
    {
        var normalizedName = SeoHelper.ToSeoFriendly(args.Name);
        if (await _context.Catalogs.AnyAsync(x => x.NormalizedName == normalizedName && x.Type == CatalogType.Product)) return TResult.Failed("Product with the same name already exists!");
        args.NormalizedName = normalizedName;
        args.Type = CatalogType.Product;
        args.CreatedDate = DateTime.Now;
        args.CreatedBy = _hcaService.GetUserId();
        args.Locale = locale;
        args.Id = Guid.NewGuid();
        await _context.Catalogs.AddAsync(args);
        await _context.Products.AddAsync(new Product
        {
            Name = args.Name,
            NormalizedName = SeoHelper.ToSeoFriendly(args.Name),
            Locale = locale
        });
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var query = from p in _context.Products
                    where p.NormalizedName == normalizedName
                    select new
                    {
                        p.Id,
                        p.Name,
                        p.NormalizedName,
                        p.Thumbnail,
                        p.CreatedDate,
                        p.ModifiedDate,
                        p.ViewCount,
                        p.Price,
                        p.SalePrice,
                        p.Description,
                        p.SKU,
                        p.Content,
                        p.UnitInStock,
                        p.AffiliateLink
                    };
        return TResult.Ok(await query.FirstOrDefaultAsync());
    }

    public async Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions)
    {
        var query = from product in _context.Products
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
                        Locale = product.Locale
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
                        Price= product.Price,
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
                        label = p.Name,
                        value = p.Id
                    };
        return await query.ToListAsync();
    }

    public async Task<IdentityResult> SaveBrandAsync(SaveBrandModel args)
    {
        var product = await _context.Catalogs.FindAsync(args.ProductId);
        if (product is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = HttpStatusCode.NoContent.ToString(),
                Description = "Product not found!"
            });
        }
        var brand = await _context.Catalogs.FindAsync(args.BrandId);
        if (brand is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = HttpStatusCode.NoContent.ToString(),
                Description = "Brand not found!"
            });
        }
        if (!product.NormalizedName.Contains('/'))
        {
            product.NormalizedName = $"{brand.NormalizedName}/{product.NormalizedName}";
        }
        product.ParentId = args.BrandId;
        await _context.SaveChangesAsync();
        return IdentityResult.Success;
    }
}
