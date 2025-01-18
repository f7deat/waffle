﻿using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository.Catalogs;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Filters.Catalogs.Collections;
using Waffle.Models.Result;
using Waffle.Models.Results.Catalogs.Collections;

namespace Waffle.Core.Services;

public class CollectionService(ICollectionRepository _collectionRepository, ICatalogService _catalogService) : ICollectionService
{
    public async Task<DefResult> AddAsync(Collection args)
    {
        var catalog = await _catalogService.FindAsync(args.CatalogId);
        if (catalog is null) return DefResult.Failed("Catalog not found!");
        await _collectionRepository.AddAsync(args);
        return DefResult.Success;
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

    public Task<ListResult<CollectionListItem>> ListAsync(CollectionFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _collectionRepository.ListAsync(filterOptions);
    }
}
