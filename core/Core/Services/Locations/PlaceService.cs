using System.Text.Json;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IRepositories;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Args;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Services.Locations;

public class PlaceService(IPlaceRepository _placeRepository, ICatalogService _catalogService) : IPlaceService
{
    public async Task<TResult> GetByIdAsync(Guid id)
    {
        var place = await _placeRepository.FindAsync(id);
        if (place is null) return TResult.Failed("Place not found!");
        var content = new BlockEditor();
        if (!string.IsNullOrEmpty(place.Content))
        {
            content = JsonSerializer.Deserialize<BlockEditor>(place.Content);
        }
        return TResult.Ok(new
        {
            place.Id,
            content,
            place.StreetId,
            place.Address
        });
    }

    public async Task<TResult> GetByNormalizedNameAsync(string normalizedName)
    {
        var catalog = await _catalogService.GetByNameAsync(normalizedName);
        if (catalog is null) return TResult.Failed("Catalog not found!");
        return await GetByIdAsync(catalog.Id);
    }

    public Task<ListResult> ListAsync(PlaceFilterOptions filterOptions) => _placeRepository.ListAsync(filterOptions);

    public async Task<TResult> UpdateAsync(PlaceUpdateArgs args)
    {
        var place = await _placeRepository.FindAsync(args.Id);
        if (place is null) return TResult.Failed("Place not found!");
        place.Content = args.Content;
        place.StreetId = args.StreetId;
        place.Address = args.Address;
        await _placeRepository.UpdateAsync(place);
        return TResult.Success;
    }
}
