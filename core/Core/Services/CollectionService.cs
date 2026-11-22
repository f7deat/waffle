using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository.Catalogs;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Results.Catalogs.Collections;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Services;

public class CollectionService(ICollectionRepository _collectionRepository) : ICollectionService
{

    public Task<Catalog?> FindByCatalogAsync(Guid catalogId) => _collectionRepository.FindByCatalogAsync(catalogId);

    public async Task<ListResult<CatalogListItem>> GetListCatalogAsync(ListCatalogCollectionFilterOptions filterOptions)
    {
        var collection = await _collectionRepository.FindByCatalogAsync(filterOptions.CatalogId);
        if (collection is null) return new ListResult<CatalogListItem>();
        return await _collectionRepository.GetListCatalogAsync(collection.Id, filterOptions);
    }

    public Task<ListResult<CollectionListItem>> ListAsync(CollectionFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _collectionRepository.ListAsync(filterOptions);
    }

    public Task<ListResult<object>> ListByCatalogAsync(ListCatalogCollectionFilterOptions filterOptions) => _collectionRepository.ListByCatalogAsync(filterOptions);

    public Task<ListResult<CollectionListItem>?> ListCatalogByCollectionAsync(ListCatalogByCollectionFilterOptions filterOptions) => _collectionRepository.GetListCatalogAsync(filterOptions);

    public async Task<TResult> UpdateAsync(Collection args)
    {
        var collection = await _collectionRepository.FindAsync(args.CatalogId, args.CollectionId);
        if (collection is null) return TResult.Failed("Collection not found!");
        collection.SortOrder = args.SortOrder;
        await _collectionRepository.UpdateAsync(collection);
        return TResult.Success;
    }
}
