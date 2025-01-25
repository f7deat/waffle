using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Results.Catalogs.Collections;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Interfaces.IRepository.Catalogs;

public interface ICollectionRepository : IAsyncRepository<Collection>
{
    Task<Catalog?> FindByCatalogAsync(Guid catalogId);
    Task<ListResult<CatalogListItem>> GetListCatalogAsync(Guid collectionId, ListCatalogCollectionFilterOptions filterOptions);
    Task<ListResult<CatalogListItem>?> GetListCatalogAsync(ListCatalogCollectionFilterOptions listCatalogCollectionFilterOptions);
    Task<bool> HasCatalogAsync(Guid collectionId);
    Task<ListResult<CollectionListItem>> ListAsync(CollectionFilterOptions filterOptions);
    Task<ListResult<CatalogListItem>> ListByCatalogAsync(ListCatalogCollectionFilterOptions filterOptions);
}
