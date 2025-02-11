using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Results.Catalogs.Collections;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Interfaces.IRepository.Catalogs;

public interface ICollectionRepository : IAsyncRepository<Collection>
{
    Task<Collection?> FindAsync(Guid catalogId, Guid collectionId);
    Task<Catalog?> FindByCatalogAsync(Guid catalogId);
    Task<ListResult<CatalogListItem>> GetListCatalogAsync(Guid collectionId, ListCatalogCollectionFilterOptions filterOptions);
    Task<ListResult<CollectionListItem>?> GetListCatalogAsync(ListCatalogByCollectionFilterOptions listCatalogCollectionFilterOptions);
    Task<bool> HasCatalogAsync(Guid collectionId);
    Task<ListResult<CollectionListItem>> ListAsync(CollectionFilterOptions filterOptions);
    Task<ListResult<object>> ListByCatalogAsync(ListCatalogCollectionFilterOptions filterOptions);
}
