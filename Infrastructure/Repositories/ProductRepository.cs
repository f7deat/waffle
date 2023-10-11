using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Extensions;
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

    public async Task<List<ProductListItem>> ListAsync(IFilterOptions filterOptions)
    {
        var query = from catalog in _context.Catalogs
                    join product in _context.Products on catalog.Id equals product.CatalogId into productCatalog from product in productCatalog.DefaultIfEmpty()
                    where catalog.Active && catalog.Type == CatalogType.Product
                    orderby catalog.ModifiedDate descending
                    select new ProductListItem
                    {
                        Id = catalog.Id,
                        Name = catalog.Name,
                        NormalizedName = catalog.NormalizedName,
                        Url = catalog.GetUrl(),
                        Thumbnail = catalog.Thumbnail,
                        ViewCount = catalog.ViewCount,
                        Price = product.Price,
                        SalePrice = product.SalePrice
                    };
        return await query.AsNoTracking().Take(filterOptions.PageSize).ToListAsync();
    }

    public async Task<IdentityResult> SaveBrandAsync(SaveBrandModel args)
    {
        var product = await _context.Catalogs.FindAsync(args.ProductId);
        if (product is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "error.dataNotFound",
                Description = "Product not found!"
            });
        }
        var brand = await _context.Catalogs.FindAsync(args.BrandId);
        if (brand is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "error.dataNotFound",
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
