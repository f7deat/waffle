using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Brands;
using Waffle.Data;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.ViewModels.Brands;

namespace Waffle.Infrastructure.Repositories;

public class BrandRepository(ApplicationDbContext context, IHCAService hcaService)
    : EfRepository<Brand>(context, hcaService), IBrandRepository
{
    public async Task<ListResult<BrandListItem>> ListAsync(BrandFilterOptions filterOptions, bool activeOnly)
    {
        try
        {
            var query = _context.Brands
                .Where(x => x.DeletedAt == null)
            .Where(brand => !activeOnly || brand.IsActive)
            .Select(brand => new BrandListItem(
                brand.Id,
                brand.Name,
                brand.NormalizedName,
                brand.Description,
                brand.Logo,
                brand.IsActive,
                _context.Products.Count(product => product.BrandId == brand.Id)));

            if (!string.IsNullOrWhiteSpace(filterOptions.Name))
            {
                var keyword = filterOptions.Name.ToLower();
                query = query.Where(brand => brand.Name.ToLower().Contains(keyword));
            }
            query = query.OrderBy(x => Guid.NewGuid());

            return await ListResult<BrandListItem>.Success(query, filterOptions);
        }
        catch (Exception ex)
        {
            return ListResult<BrandListItem>.Failed(ex.ToString());
        }
    }

    public Task<BrandListItem?> GetActiveByNormalizedNameAsync(string normalizedName)
        => _context.Brands
            .Where(brand => !brand.DeletedAt.HasValue && brand.IsActive && brand.NormalizedName == normalizedName)
            .Select(brand => new BrandListItem(
                brand.Id,
                brand.Name,
                brand.NormalizedName,
                brand.Description,
                brand.Logo,
                brand.IsActive,
                _context.Products.Count(product => product.BrandId == brand.Id)))
            .FirstOrDefaultAsync();

    public async Task<IEnumerable<object>> OptionsAsync(string? keywords)
    {
        var query = _context.Brands.Where(brand => !brand.DeletedAt.HasValue && brand.IsActive);
        if (!string.IsNullOrWhiteSpace(keywords))
        {
            var keyword = keywords.ToLower();
            query = query.Where(brand => brand.Name.ToLower().Contains(keyword));
        }

        return await query
            .OrderBy(brand => brand.Name)
            .Select(brand => new { label = brand.Name, value = brand.Id })
            .ToListAsync<object>();
    }

    public Task<bool> IsNameTakenAsync(string normalizedName, int id)
        => _context.Brands.AnyAsync(brand =>
            !brand.DeletedAt.HasValue && brand.NormalizedName == normalizedName && brand.Id != id);

}
