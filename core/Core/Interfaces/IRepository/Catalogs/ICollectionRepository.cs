using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Results.Catalogs.Collections;

namespace Waffle.Core.Interfaces.IRepository.Catalogs;

public interface ICollectionRepository : IAsyncRepository<Collection>
{
    Task<bool> HasCatalogAsync(Guid collectionId);
    Task<ListResult<CollectionListItem>> ListAsync(CollectionFilterOptions filterOptions);
}
