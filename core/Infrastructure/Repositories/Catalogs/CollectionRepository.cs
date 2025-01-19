using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository.Catalogs;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Results.Catalogs.Collections;
using Waffle.Models.ViewModels;

namespace Waffle.Infrastructure.Repositories.Catalogs;

public class CollectionRepository(ApplicationDbContext context) : EfRepository<Collection>(context), ICollectionRepository
{
    public async Task<Catalog?> FindByCatalogAsync(Guid catalogId)
    {
        var query = from a in _context.Catalogs
                    join b in _context.Collections on a.Id equals b.CollectionId
                    where a.Active && b.CatalogId == catalogId && a.Type == CatalogType.Collection
                    select a;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<ListResult<CatalogListItem>> GetListCatalogAsync(Guid collectionId, ListCatalogCollectionFilterOptions filterOptions)
    {
        var query = from a in _context.Collections
                    join b in _context.Catalogs on a.CatalogId equals b.Id
                    where b.Active && a.CollectionId == collectionId && b.Locale == filterOptions.Locale
                    select new CatalogListItem
                    {
                        Id = b.Id,
                        Name = b.Name,
                        Url = b.Url,
                        CreatedDate = b.CreatedDate,
                        ModifiedDate = b.ModifiedDate,
                        Description = b.Description,
                        ViewCount = b.ViewCount,
                        Thumbnail = b.Thumbnail,
                        Type = b.Type
                    };
        return await ListResult<CatalogListItem>.Success(query, filterOptions);
    }

    public async Task<bool> HasCatalogAsync(Guid collectionId) => await _context.Collections.AnyAsync(x => x.CollectionId == collectionId);

    public async Task<ListResult<CollectionListItem>> ListAsync(CollectionFilterOptions filterOptions)
    {
        var query = from a in _context.Collections
                    join b in _context.Catalogs on a.CollectionId equals b.Id
                    select new CollectionListItem
                    {
                        Id = a.CatalogId,
                        CreatedDate = b.CreatedDate,
                        ModifiedDate = b.ModifiedDate,
                        Name = b.Name,
                        NormalizedName = b.NormalizedName
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.NormalizedName.Contains(filterOptions.Name));
        }
        query = query.GroupBy(x => x.Id).Select(x => new CollectionListItem
        {
            CreatedDate = x.First().CreatedDate,
            ModifiedDate = x.First().ModifiedDate,
            Name = x.First().Name,
            NormalizedName = x.First().NormalizedName,
            Id = x.Key
        }).OrderByDescending(x => x.CreatedDate);
        return await ListResult<CollectionListItem>.Success(query, filterOptions);
    }

    public async Task<ListResult<CatalogListItem>> ListByCatalogAsync(ListCatalogCollectionFilterOptions filterOptions)
    {
        var query = from a in _context.Catalogs
                    join b in _context.Collections on a.Id equals b.CollectionId
                    where b.CatalogId == filterOptions.CatalogId && a.Locale == filterOptions.Locale
                    select new CatalogListItem
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Url = a.Url,
                        CreatedDate = a.CreatedDate,
                        ModifiedDate = a.ModifiedDate,
                        Active = a.Active,
                        Thumbnail = a.Thumbnail,
                        ViewCount = a.ViewCount
                    };
        return await ListResult<CatalogListItem>.Success(query, filterOptions);
    }
}
