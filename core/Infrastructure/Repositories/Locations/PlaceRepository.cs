using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.IRepositories;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Data;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.Locations;

public class PlaceRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Place>(context, hcaService), IPlaceRepository
{
    public async Task<IEnumerable<PlaceImage>> GetImagesAsync(Guid id) => await _context.PlaceImages.Where(pi => pi.PlaceId == id).AsNoTracking().ToListAsync();

    public async Task<ListResult> GetRandomAsync(PlaceFilterOptions filterOptions)
    {
        var query = from p in _context.Places
                    join c in _context.Catalogs on p.Id equals c.Id
                    join s in _context.Streets on p.StreetId equals s.Id into ps
                    from s in ps.DefaultIfEmpty()
                    join d in _context.Districts on s.DistrictId equals d.Id into sd
                    from d in sd.DefaultIfEmpty()
                    join province in _context.Provinces on d.ProvinceId equals province.Id into dp
                    from province in dp.DefaultIfEmpty()
                    where c.Active && c.Locale == filterOptions.Locale
                    select new
                    {
                        p.Id,
                        c.Name,
                        c.ViewCount,
                        c.NormalizedName,
                        StreetName = c.Name,
                        p.StreetId,
                        c.ModifiedDate,
                        DistrictName = d.Name,
                        s.DistrictId,
                        ProvinceName = province.Name,
                        d.ProvinceId,
                        c.Thumbnail
                    };
        if (filterOptions.DistrictId.HasValue)
        {
            query = query.Where(x => x.DistrictId == filterOptions.DistrictId);
        }
        if (filterOptions.StreetId.HasValue)
        {
            query = query.Where(x => x.StreetId == filterOptions.StreetId);
        }
        query = query.OrderBy(r => EF.Functions.Random()).Take(filterOptions.PageSize);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<ListResult> ListAsync(PlaceFilterOptions filterOptions)
    {
        var query = from p in _context.Places
                    join c in _context.Catalogs on p.Id equals c.Id
                    join s in _context.Streets on p.StreetId equals s.Id into ps
                    from s in ps.DefaultIfEmpty()
                    join d in _context.Districts on s.DistrictId equals d.Id into sd
                    from d in sd.DefaultIfEmpty()
                    join province in _context.Provinces on d.ProvinceId equals province.Id into dp
                    from province in dp.DefaultIfEmpty()
                    where c.Active && c.Locale == filterOptions.Locale
                    select new
                    {
                        p.Id,
                        c.Name,
                        c.ViewCount,
                        c.NormalizedName,
                        StreetName = c.Name,
                        p.StreetId,
                        c.ModifiedDate,
                        DistrictName = d.Name,
                        s.DistrictId,
                        ProvinceName = province.Name,
                        d.ProvinceId,
                        c.Thumbnail
                    };
        if (filterOptions.DistrictId.HasValue)
        {
            query = query.Where(x => x.DistrictId == filterOptions.DistrictId);
        }
        if (filterOptions.StreetId.HasValue)
        {
            query = query.Where(x => x.StreetId == filterOptions.StreetId);
        }
        query = query.OrderByDescending(x => x.ModifiedDate);
        return await ListResult.Success(query, filterOptions);
    }
}
