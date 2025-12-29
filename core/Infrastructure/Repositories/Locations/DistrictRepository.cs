using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Data;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.Locations;

public class DistrictRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<District>(context, hcaService), IDistrictRepository
{
    public async Task<object> GetOptionsAsync(DistrictSelectOptions filterOptions)
    {
        var query = from d in _context.Districts
                    select new { d.Id, d.Name, d.ProvinceId };
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
            Value = x.Id
        }).ToListAsync();
    }

    public async Task<ListResult> ListAsync(DistrictFilterOptions filterOptions)
    {
        var query = from d in _context.Districts
                    join p in _context.Provinces on d.ProvinceId equals p.Id
                    select new
                    {
                        d.Id,
                        d.Name,
                        d.ProvinceId,
                        ProvinceName = p.Name,
                        Thumbnail = (from pl in _context.Places
                                     join c in _context.Catalogs on pl.Id equals c.Id
                                     where pl.DistrictId == d.Id
                                     select c.Thumbnail).FirstOrDefault()
                    };
        if (filterOptions.ProvinceId.HasValue)
        {
            query = query.Where(x => x.ProvinceId == filterOptions.ProvinceId);
        }
        query = query.OrderByDescending(x => x.Id);
        return await ListResult.Success(query, filterOptions);
    }
}
