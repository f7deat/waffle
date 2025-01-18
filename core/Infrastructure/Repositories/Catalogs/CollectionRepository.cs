using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository.Catalogs;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Results.Catalogs.Collections;

namespace Waffle.Infrastructure.Repositories.Catalogs;

public class CollectionRepository(ApplicationDbContext context) : EfRepository<Collection>(context), ICollectionRepository
{
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
        query = query.OrderByDescending(x => x.CreatedDate);
        return await ListResult<CollectionListItem>.Success(query, filterOptions);
    }
}
