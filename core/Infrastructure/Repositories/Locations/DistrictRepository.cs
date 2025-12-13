using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Data;
using Waffle.Entities.Locations;

namespace Waffle.Infrastructure.Repositories.Locations;

public class DistrictRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<District>(context, hcaService), IDistrictRepository
{
    public async Task<object> GetOptionsAsync(DistrictSelectOptions filterOptions)
    {
        var query = from d in _context.Districts
                    join p in _context.Provinces on d.ProvinceId equals p.Id
                    select new { d.Id, d.Name, d.ProvinceId, p.CountryId };
        if (filterOptions.CountryId.HasValue)
        {
            query = query.Where(x => x.CountryId == filterOptions.CountryId);
        }
        if (filterOptions.ProvinceId.HasValue)
        {
            query = query.Where(x => x.ProvinceId == filterOptions.ProvinceId);
        }
        if (!string.IsNullOrWhiteSpace(filterOptions.KeyWords))
        {
            query = query.Where(x => x.Name.ToLower().Contains(filterOptions.KeyWords.ToLower()));
        }
        return await query.Select(x => new
        {
            Label = x.Name,
            Value = x.ProvinceId
        }).ToListAsync();
    }
}
