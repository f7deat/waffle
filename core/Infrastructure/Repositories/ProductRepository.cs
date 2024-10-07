using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Infrastructure.Repositories;

public class ProductRepository : EfRepository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Product?> FindByCatalogAsync(Guid catalogId) => await _context.Products.FirstOrDefaultAsync(x => x.CatalogId == catalogId);

    public async Task<ListResult<ProductListItem>> ListAsync(ProductFilterOptions filterOptions)
    {
        var query = from catalog in _context.Catalogs
                    join product in _context.Products on catalog.Id equals product.CatalogId into productCatalog from product in productCatalog.DefaultIfEmpty()
                    join parent in _context.Catalogs on catalog.ParentId equals parent.Id into cp from parent in cp.DefaultIfEmpty()
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
                        Category = parent.NormalizedName,
                        Description = catalog.Description,
                        Type = catalog.Type,
                        ModifiedDate = catalog.ModifiedDate,
                        Locale = catalog.Locale
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
                        Category = c.NormalizedName
                    };
        return await query.OrderBy(x => Guid.NewGuid()).Take(4).ToListAsync();
    }

    public async Task<IEnumerable<ProductListItem>> ListRelatedAsync(PageData pageData)
    {
        var query = (from catalog in _context.Catalogs
                     join product in _context.Products on catalog.Id equals product.CatalogId into productCatalog from product in productCatalog.DefaultIfEmpty()
                     where catalog.Active && catalog.ParentId == pageData.ParentId && catalog.Type == CatalogType.Product && catalog.Id != pageData.Id
                     select new ProductListItem
                     {
                         Id = catalog.Id,
                         Name = catalog.Name,
                         Thumbnail = catalog.Thumbnail,
                         Price = product.Price,
                         SalePrice = product.SalePrice
                     }).Distinct().OrderByDescending(x => Guid.NewGuid());
        return await query.Take(4).ToListAsync();
    }

    public async Task<IEnumerable<ProductListItem>> ListSpotlightAsync(int pageSize, IEnumerable<Guid> tagIds, string locale)
    {
        var query = from catalog in _context.Catalogs
                    join product in _context.Products on catalog.Id equals product.CatalogId into catalogProduct
                    from product in catalogProduct.DefaultIfEmpty()
                    join tag in _context.WorkItems on catalog.Id equals tag.WorkId
                    join p in _context.Catalogs on catalog.ParentId equals p.Id into pc from p in pc.DefaultIfEmpty()
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
                        ModifiedDate = catalog.ModifiedDate,
                        Category = p.NormalizedName,
                        Type = catalog.Type
                    };
        return await query.Distinct().OrderBy(x => Guid.NewGuid()).Take(pageSize).AsNoTracking().ToListAsync();
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
