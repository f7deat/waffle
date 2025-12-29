using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Models;
using Waffle.Core.IServices.Shops;
using Waffle.Data;
using Waffle.Entities.Affliates;
using Waffle.Models.Filters.Affiliates;

namespace Waffle.Core.Services.Affiliates;

public class AffiliateService(ApplicationDbContext _context) : IAffiliateService
{
    public async Task<TResult> AddLinkAsync(AffiliateLink args)
    {
        if (string.IsNullOrWhiteSpace(args.Url)) return TResult.Failed("Link is required");
        if (await _context.AffiliateLinks.AnyAsync(x => x.Url == args.Url)) return TResult.Failed("Link already exists");
        args.CreatedDate = DateTime.Now;
        await _context.AffiliateLinks.AddAsync(args);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> DeleteLinkAsync(Guid id)
    {
        var affliateLink = await _context.AffiliateLinks.FindAsync(id);
        if (affliateLink is null) return TResult.Failed("Affiliate link not found");
        _context.AffiliateLinks.Remove(affliateLink);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<object?> ListAsync(AffiliateFilterOptions filterOptions)
    {
        var query = from a in _context.AffiliateLinks
                    select a;
        if (filterOptions.CatalogId != null)
        {
            query = query.Where(a => a.CatalogId == filterOptions.CatalogId);
        }
        return new
        {
            data = await query.OrderByDescending(x => x.ModifiedDate).Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync(),
            total = await query.CountAsync()
        };
    }
}
