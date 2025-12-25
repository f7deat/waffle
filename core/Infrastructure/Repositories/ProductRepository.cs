using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.Result;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Infrastructure.Repositories;

public class ProductRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Product>(context, hcaService), IProductRepository
{
    public async Task<bool> AnyAsync(Guid productId) => await _context.Products.AnyAsync(x => x.Id == productId);

    public async Task<DefResult> CreateAsync(Catalog args, string locale)
    {
        var normalizedName = SeoHelper.ToSeoFriendly(args.Name);
        if (await _context.Catalogs.AnyAsync(x => x.NormalizedName == normalizedName && x.Type == CatalogType.Product)) return DefResult.Failed("Product with the same name already exists!");
        args.NormalizedName = normalizedName;
        args.Type = CatalogType.Product;
        args.CreatedDate = DateTime.Now;
        args.CreatedBy = _hcaService.GetUserId();
        args.Locale = locale;
        args.Id = Guid.NewGuid();
        await _context.Catalogs.AddAsync(args);
        await _context.Products.AddAsync(new Product
        {
            CatalogId = args.Id
        });
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }

    public async Task<Product?> FindByCatalogAsync(Guid catalogId) => await _context.Products.FirstOrDefaultAsync(x => x.CatalogId == catalogId);

    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var query = from c in _context.Catalogs
                    join p in _context.Products on c.Id equals p.CatalogId
                    where c.NormalizedName == normalizedName && c.Type == CatalogType.Product && c.Active
                    select new
                    {
                        c.Id,
                        c.Name,
                        c.NormalizedName,
                        c.Thumbnail,
                        c.CreatedDate,
                        c.ModifiedDate,
                        c.ViewCount,
                        p.Price,
                        p.SalePrice,
                        c.Description,
                        p.SKU,
                        p.Content,
                        p.UnitInStock,
                        p.AffiliateLink
                    };
        return TResult.Ok(await query.FirstOrDefaultAsync());
    }

    public async Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions)
    {
        var query = from catalog in _context.Catalogs
                    join product in _context.Products on catalog.Id equals product.CatalogId into productCatalog from product in productCatalog.DefaultIfEmpty()
                    where catalog.Active && catalog.Type == CatalogType.Product 
                    && (filterOptions.ParentId == null || catalog.ParentId == filterOptions.ParentId)
                    && (filterOptions.Active == null || catalog.Active == filterOptions.Active)
                    select new ProductListItem
                    {
                        Id = catalog.Id,
                        Name = catalog.Name,
                        NormalizedName = catalog.NormalizedName,
                        Thumbnail = catalog.Thumbnail,
                        ViewCount = catalog.ViewCount,
                        Price = product.Price,
                        SalePrice = product.SalePrice,
                        Description = catalog.Description,
                        Type = catalog.Type,
                        ModifiedDate = catalog.ModifiedDate ?? catalog.CreatedDate,
                        Locale = catalog.Locale,
                        Url = catalog.Url ?? $"/{catalog.Type}/{catalog.NormalizedName}".ToLower()
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
        var query = from a in _context.WorkItems
                    join b in _context.Catalogs on a.WorkId equals b.Id
                    join product in _context.Products on b.Id equals product.CatalogId into productCatalog from product in productCatalog.DefaultIfEmpty()
                    join c in _context.Catalogs on b.ParentId equals c.Id into bc from c in bc.DefaultIfEmpty()
                    where a.CatalogId == tagId && b.Active &&
                    (string.IsNullOrEmpty(filterOptions.Name) || b.NormalizedName.Contains(filterOptions.Name)) &&
                    (filterOptions.Type == null || b.Type == filterOptions.Type)
                    orderby b.ModifiedDate descending
                    select new ProductListItem
                    {
                        Id = b.Id,
                        Name = b.Name,
                        Thumbnail = b.Thumbnail,
                        Price= product.Price,
                        SalePrice = product.SalePrice,
                        Category = c.NormalizedName,
                        Url = b.Url ?? $"/{b.Type}/{b.NormalizedName}".ToLower()
                    };
        return await query.OrderBy(x => Guid.NewGuid()).Take(4).ToListAsync();
    }

    public async Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData)
    {
        var query = (from catalog in _context.Catalogs
                     join product in _context.Products on catalog.Id equals product.CatalogId into productCatalog from product in productCatalog.DefaultIfEmpty()
                     where catalog.Active && catalog.ParentId == pageData.ParentId && catalog.Type == CatalogType.Product && catalog.Id != pageData.Id
                     && catalog.Locale == pageData.Locale
                     select new ProductListItem
                     {
                         Id = catalog.Id,
                         Name = catalog.Name,
                         Thumbnail = catalog.Thumbnail,
                         Price = product.Price,
                         SalePrice = product.SalePrice,
                         Url = catalog.Url ?? catalog.NormalizedName
                     }).Distinct().OrderByDescending(x => Guid.NewGuid());
        return await query.Take(4).ToListAsync();
    }

    public async Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale)
    {
        var query = from catalog in _context.Catalogs
                    join product in _context.Products on catalog.Id equals product.CatalogId into catalogProduct
                    from product in catalogProduct.DefaultIfEmpty()
                    join tag in _context.WorkItems on catalog.Id equals tag.WorkId
                    where catalog.Type == CatalogType.Product && catalog.Active
                    && (!tagIds.Any() || tagIds.Contains(tag.CatalogId))
                    && catalog.Locale == locale
                    select new ProductListItem
                    {
                        Name = catalog.Name,
                        Id = catalog.Id,
                        NormalizedName = catalog.NormalizedName,
                        Price = product.Price,
                        SalePrice = product.SalePrice,
                        Thumbnail = catalog.Thumbnail,
                        ViewCount = catalog.ViewCount,
                        ModifiedDate = catalog.ModifiedDate ?? catalog.CreatedDate,
                        Type = catalog.Type,
                        Url = catalog.Url ?? $"/{catalog.Type}/{catalog.NormalizedName}".ToLower()
                    };
        return await query.Distinct().OrderBy(x => Guid.NewGuid()).Take(pageSize).AsNoTracking().ToListAsync();
    }

    public async Task<ListResult<object>> NewArrivalsAsync(ProductFilterOptions filterOptions)
    {
        var query = from a in _context.Products
                    join b in _context.Catalogs on a.CatalogId equals b.Id
                    where b.Type == CatalogType.Product && b.Active && b.Locale == filterOptions.Locale
                    orderby b.ModifiedDate descending
                    select new
                    {
                        id = b.Id,
                        name = b.Name,
                        normalizedName = b.NormalizedName,
                        thumbnail = b.Thumbnail,
                        price = a.Price,
                        salePrice = a.SalePrice,
                        description = b.Description,
                        type = b.Type,
                        modifiedDate = b.ModifiedDate
                    };
        return await ListResult<object>.Success(query, filterOptions);
    }

    public async Task<object> OptionsAsync(SelectOptions selectOptions)
    {
        var query = from c in _context.Catalogs
                    join p in _context.Products on c.Id equals p.CatalogId
                    where c.Type == CatalogType.Product && c.Active
                    orderby c.NormalizedName ascending
                    select new
                    {
                        label = c.Name,
                        value = c.Id
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
