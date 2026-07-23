using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities.Ecommerces;

namespace Waffle.Infrastructure.Repositories;

public class ProductTagRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<ProductTag>(context, hcaService), IProductTagRepository
{
    public async Task<IEnumerable<ProductTag>> ListByProductIdAsync(Guid productId)
    {
        return await _context.ProductTags
            .Where(x => x.ProductId == productId)
            .Include(x => x.Tag)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task SyncAsync(Guid productId, IEnumerable<Guid> tagIds)
    {
        var existingTags = await _context.ProductTags.Where(x => x.ProductId == productId).ToListAsync();
        if (existingTags.Count > 0)
        {
            _context.ProductTags.RemoveRange(existingTags);
        }

        var distinctTagIds = tagIds.Distinct().ToList();
        if (distinctTagIds.Count > 0)
        {
            await _context.ProductTags.AddRangeAsync(distinctTagIds.Select(tagId => new ProductTag
            {
                ProductId = productId,
                TagId = tagId,
            }));
        }

        await _context.SaveChangesAsync();
    }
}