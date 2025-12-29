using Waffle.Core.Foundations.Models;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Results.Catalogs.Collections;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Interfaces.IService;

public interface ICollectionService
{
    Task<TResult> AddAsync(Collection args);
    Task<TResult> DeleteAsync(Collection args);
    Task<TResult> DeleteCatalogAsync(Collection args);
    Task<Catalog?> FindByCatalogAsync(Guid id);
    Task<ListResult<CatalogListItem>> GetListCatalogAsync(ListCatalogCollectionFilterOptions filterOptions);
    Task<ListResult<CollectionListItem>> ListAsync(CollectionFilterOptions filterOptions);
    Task<ListResult<object>> ListByCatalogAsync(ListCatalogCollectionFilterOptions filterOptions);
    Task<ListResult<CollectionListItem>?> ListCatalogByCollectionAsync(ListCatalogByCollectionFilterOptions listCatalogCollectionFilterOptions);
    Task<TResult> UpdateAsync(Collection args);
}
