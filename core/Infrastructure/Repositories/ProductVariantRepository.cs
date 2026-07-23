using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities.Ecommerces;

namespace Waffle.Infrastructure.Repositories;

public class ProductVariantRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<ProductVariant>(context, hcaService), IProductVariantRepository
{
    public async Task<IEnumerable<ProductVariant>> ListByProductIdAsync(Guid productId)
    {
        return await _context.ProductVariants
            .Where(x => x.ProductId == productId)
            .OrderBy(x => x.SortOrder)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task SyncAsync(Guid productId, IEnumerable<ProductVariant> variants)
    {
        var existingVariants = await _context.ProductVariants.Where(x => x.ProductId == productId).ToListAsync();
        if (existingVariants.Count > 0)
        {
            _context.ProductVariants.RemoveRange(existingVariants);
        }

        var cleanedVariants = variants
            .Where(x => !string.IsNullOrWhiteSpace(x.Name)
                || !string.IsNullOrWhiteSpace(x.SKU)
                || x.Price != null
                || x.SalePrice != null
                || x.UnitInStock != null
                || !string.IsNullOrWhiteSpace(x.Thumbnail))
            .Select((x, index) => new ProductVariant
            {
                ProductId = productId,
                Name = x.Name,
                SKU = x.SKU,
                Price = x.Price,
                SalePrice = x.SalePrice,
                UnitInStock = x.UnitInStock,
                Thumbnail = x.Thumbnail,
                SortOrder = index
            })
            .ToList();

        if (cleanedVariants.Count > 0)
        {
            await _context.ProductVariants.AddRangeAsync(cleanedVariants);
        }

        await _context.SaveChangesAsync();
    }
}