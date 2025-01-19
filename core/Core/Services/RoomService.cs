using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Args.Catalogs;
using Waffle.Models.List;
using Waffle.Models.Result;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Services;

public class RoomService(ApplicationDbContext _context) : IRoomService
{
    public async Task<DefResult> InitAsync(Guid catalogId)
    {
        await _context.Rooms.AddAsync(new Room { CatalogId = catalogId });
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }

    public async Task<DefResult> DeleteAsync(Guid catalogId)
    {
        var catalog = await _context.Catalogs.FindAsync(catalogId);
        if (catalog == null) return DefResult.Failed("Catalog not found!");
        var room = await _context.Rooms.FirstOrDefaultAsync(x => x.CatalogId == catalog.Id);
        if (room != null)
        {
            _context.Rooms.Remove(room);
        }
        _context.Catalogs.Remove(catalog);
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }

    public async Task<DefResult> SaveAsync(RoomArgs args)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(x => x.CatalogId == args.CatalogId);
        if (room is null) return DefResult.Failed("Room not found!");
        room.AffiliateLink = args.AffiliateLink;
        if (args.Galleries != null && args.Galleries.Count != 0)
        {
            room.Galleries = string.Join(",", args.Galleries);
        }
        _context.Rooms.Update(room);
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }

    public Task<ListResult<RoomListItem>> GetRoomsAsync(BasicFilterOptions filterOptions)
    {
        var query = from a in _context.Catalogs.Where(x => x.Type == CatalogType.Room)
                    join b in _context.Rooms on a.Id equals b.CatalogId
                    where a.Active
                    select new RoomListItem
                    {
                        Id = a.Id,
                        Name = a.Name,
                        AffiliateLink = b.AffiliateLink,
                        Thumbnail = a.Thumbnail,
                        ViewCount = a.ViewCount,
                        ModifiedDate = a.ModifiedDate,
                        Description = a.Description,
                        Url = a.Url,
                        City = _context.Catalogs.First(x => x.Id == a.ParentId).Name,
                    };
        query = query.OrderByDescending(x => x.ModifiedDate);
        return ListResult<RoomListItem>.Success(query, filterOptions);
    }

    public async Task<Room?> GetByCatalogAsync(Guid catalogId)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(x => x.CatalogId == catalogId);
        if (room is null) return default;
        return room;
    }

    public async Task<IEnumerable<CatalogListItem>> GetCitiesAsync(Guid countryId)
    {
        var query = from a in _context.Catalogs
                    where a.ParentId == countryId && a.Active && a.Type == CatalogType.City
                    select new CatalogListItem
                    {
                        Id = a.Id,
                        Name = a.Name,
                        ModifiedDate = a.ModifiedDate,
                        Description = a.Description,
                        Url = a.Url,
                        CreatedDate = a.CreatedDate,
                        ViewCount = a.ViewCount,
                        CreatedBy = a.CreatedBy,
                        Locale = a.Locale,
                        Type = a.Type,
                        NormalizedName = a.NormalizedName,
                        Thumbnail = a.Thumbnail
                    };
        return await query.ToListAsync();
    }
}
