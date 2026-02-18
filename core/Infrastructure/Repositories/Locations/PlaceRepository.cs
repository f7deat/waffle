using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.IRepositories;
using Waffle.Core.Services.Catalogs.Results;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Data;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.Locations;

public class PlaceRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Place>(context, hcaService), IPlaceRepository
{
    public async Task AddImagesAsync(List<PlaceImage> images) => await _context.PlaceImages.AddRangeAsync(images);

    public async Task DeleteImageAsync(PlaceImage placeImage)
    {
        _context.PlaceImages.Remove(placeImage);
        await _context.SaveChangesAsync();
    }

    public async Task<PlaceImage?> GetImageById(Guid imageId) => await _context.PlaceImages.FindAsync(imageId);

    public async Task<IEnumerable<PlaceImage>> GetImagesAsync(Guid id) => await _context.PlaceImages.Where(pi => pi.PlaceId == id).AsNoTracking()
        .OrderByDescending(x => x.UploadedAt)
        .ToListAsync();

    public async Task<object?> GetInfluencerAsync(Guid? influencerId)
    {
        if (influencerId is null) return default;
        return await (from u in _context.Users
                      where u.Id == influencerId
                      select new
                      {
                          u.Id,
                          u.UserName,
                          u.Name,
                          u.Avatar
                      }).FirstOrDefaultAsync();
    }

    public async Task<ListResult> GetRandomAsync(PlaceFilterOptions filterOptions)
    {
        var query = from p in _context.Places
                    join c in _context.Catalogs on p.Id equals c.Id
                    join d in _context.Districts on p.DistrictId equals d.Id into sd
                    from d in sd.DefaultIfEmpty()
                    join province in _context.Provinces on d.ProvinceId equals province.Id into dp
                    from province in dp.DefaultIfEmpty()
                    where c.Active && c.Locale == filterOptions.Locale
                    select new PlaceListItem
                    {
                        Id = p.Id,
                        Name = c.Name,
                        ViewCount = c.ViewCount,
                        NormalizedName = c.NormalizedName,
                        ModifiedDate = c.ModifiedDate,
                        DistrictName = d.Name,
                        DistrictId = p.DistrictId,
                        ProvinceName = province.Name,
                        ProvinceId = d.ProvinceId,
                        Thumbnail = c.Thumbnail
                    };
        if (filterOptions.DistrictId.HasValue)
        {
            query = query.Where(x => x.DistrictId == filterOptions.DistrictId);
        }
        query = query.OrderBy(r => EF.Functions.Random()).Take(filterOptions.PageSize);
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<ListResult> ListAsync(PlaceFilterOptions filterOptions)
    {
        var query = from p in _context.Places
                    join c in _context.Catalogs on p.Id equals c.Id
                    join d in _context.Districts on p.DistrictId equals d.Id into sd
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
                        c.ModifiedDate,
                        DistrictName = d.Name,
                        p.DistrictId,
                        ProvinceName = province.Name,
                        d.ProvinceId,
                        c.Thumbnail
                    };
        if (filterOptions.DistrictId.HasValue)
        {
            query = query.Where(x => x.DistrictId == filterOptions.DistrictId);
        }
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        query = query.OrderByDescending(x => x.ModifiedDate);
        return await ListResult.Success(query, filterOptions);
    }
}
