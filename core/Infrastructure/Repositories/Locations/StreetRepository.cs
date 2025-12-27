using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.IRepositories;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Data;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.Locations;

public class StreetRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Street>(context, hcaService), IStreetRepository
{
    public async Task<ListResult> GetListAsync(StreetFilterOptions filterOptions)
    {
        var query = from s in _context.Streets
                    join d in _context.Districts on s.DistrictId equals d.Id
                    select new
                    {
                        s.Id,
                        s.Name,
                        s.DistrictId,
                        PlaceCount = _context.Places.Count(p => p.DistrictId == s.Id),
                        Thumbnail = (from p in _context.Places
                                     join c in _context.Catalogs on p.Id equals c.Id
                                     where p.DistrictId == s.Id
                                     select c.Thumbnail).FirstOrDefault(),
                        DistrictName = d.Name,
                        d.ProvinceId
                    };
        if (filterOptions.DistrictId.HasValue)
        {
            query = query.Where(s => s.DistrictId == filterOptions.DistrictId);
        }
        query = query.OrderBy(s => s.Id);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<object> GetOptionsAsync(StreetSelectOptions selectOptions)
    {
        var query = from s in _context.Streets
                    select new
                    {
                        s.Id,
                        s.Name,
                        s.DistrictId
                    };
        if (selectOptions.DistrictId.HasValue)
        {
            query = query.Where(s => s.DistrictId == selectOptions.DistrictId);
        }
        return await query.Select(s => new
        {
            Value = s.Id,
            Label = s.Name
        }).ToListAsync();
    }

    public async Task<bool> IsExistAsync(int districtId, string name) => await _context.Streets.AnyAsync(s => s.DistrictId == districtId && s.Name == name);
}
