﻿using Microsoft.EntityFrameworkCore;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository.Catalogs;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Result;
using Waffle.Models.Results.Catalogs.Collections;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Services;

public class CollectionService(ICollectionRepository _collectionRepository, ICatalogService _catalogService, ApplicationDbContext _context) : ICollectionService
{
    public async Task<DefResult> AddAsync(Collection args)
    {
        try
        {
            var catalog = await _catalogService.FindAsync(args.CatalogId);
            if (catalog is null) return DefResult.Failed("Catalog not found!");
            var collection = await _catalogService.FindAsync(args.CollectionId);
            if (collection is null) return DefResult.Failed("Collection not found!");
            await _collectionRepository.AddAsync(args);
            return DefResult.Success;
        }
        catch (Exception ex)
        {
            return DefResult.Failed(ex.ToString());
        }
    }

    public async Task<DefResult> DeleteAsync(Collection args)
    {
        if (!await _collectionRepository.HasCatalogAsync(args.CollectionId))
        {
            var collection = await _catalogService.FindAsync(args.CatalogId);
            if (collection is null) return DefResult.Failed("Catalog not found!");
            await _catalogService.DeleteAsync(collection);
        }
        return DefResult.Success;
    }

    public async Task<DefResult> DeleteCatalogAsync(Collection args)
    {
        var catalog = await _context.Collections.FirstOrDefaultAsync(x => x.CatalogId == args.CatalogId && x.CollectionId == args.CollectionId);
        if (catalog is null) return DefResult.Failed("Catalog not found!");
        _context.Collections.Remove(catalog);
        await _context.SaveChangesAsync();
        return DefResult.Success;
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

    public async Task<DefResult> UpdateAsync(Collection args)
    {
        var collection = await _collectionRepository.FindAsync(args.CatalogId, args.CollectionId);
        if (collection is null) return DefResult.Failed("Collection not found!");
        collection.SortOrder = args.SortOrder;
        await _collectionRepository.UpdateAsync(collection);
        return DefResult.Success;
    }
}
