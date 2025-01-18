using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Result;
using Waffle.Models.Results.Catalogs.Collections;

namespace Waffle.Core.Interfaces.IService;

public interface ICollectionService
{
    Task<DefResult> AddAsync(Entities.Collection args);
    Task<DefResult> DeleteAsync(Collection args);
    Task<ListResult<CollectionListItem>> ListAsync(CollectionFilterOptions filterOptions);
}
