using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities.Ecommerces;

namespace Waffle.Infrastructure.Repositories;

public class ProductImageRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<ProductImage>(context, hcaService), IProductImageRepository
{
    public async Task<IEnumerable<ProductImage>> ListByProductIdAsync(Guid productId)
    {
        return await _context.ProductImages
            .Where(x => x.ProductId == productId)
            .OrderBy(x => x.SortOrder)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task SyncAsync(Guid productId, IEnumerable<ProductImage> images)
    {
        var existingImages = await _context.ProductImages.Where(x => x.ProductId == productId).ToListAsync();
        if (existingImages.Count > 0)
        {
            _context.ProductImages.RemoveRange(existingImages);
        }

        var cleanedImages = images
            .Where(x => !string.IsNullOrWhiteSpace(x.Url))
            .Select((x, index) => new ProductImage
            {
                ProductId = productId,
                Url = x.Url.Trim(),
                SortOrder = index
            })
            .ToList();

        if (cleanedImages.Count > 0)
        {
            await _context.ProductImages.AddRangeAsync(cleanedImages);
        }

        await _context.SaveChangesAsync();
    }
}