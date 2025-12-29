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

public class CollectionService(ICollectionRepository _collectionRepository, ICatalogService _catalogService, ApplicationDbContext _context) : ICollectionService
{
    public async Task<TResult> AddAsync(Collection args)
    {
        try
        {
            var catalog = await _catalogService.FindAsync(args.CatalogId);
            if (catalog is null) return TResult.Failed("Catalog not found!");
            var collection = await _catalogService.FindAsync(args.CollectionId);
            if (collection is null) return TResult.Failed("Collection not found!");
            await _collectionRepository.AddAsync(args);
            return TResult.Success;
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> DeleteAsync(Collection args)
    {
        if (!await _collectionRepository.HasCatalogAsync(args.CollectionId))
        {
            var collection = await _catalogService.FindAsync(args.CatalogId);
            if (collection is null) return TResult.Failed("Catalog not found!");
            await _catalogService.DeleteAsync(collection);
        }
        return TResult.Success;
    }

    public async Task<TResult> DeleteCatalogAsync(Collection args)
    {
        var catalog = await _context.Collections.FirstOrDefaultAsync(x => x.CatalogId == args.CatalogId && x.CollectionId == args.CollectionId);
        if (catalog is null) return TResult.Failed("Catalog not found!");
        _context.Collections.Remove(catalog);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

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
