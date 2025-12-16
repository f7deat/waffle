using Waffle.Core.Foundations.Models;
using Waffle.Core.IRepositories;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Args;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Models;

namespace Waffle.Core.Services.Locations;

public class PlaceService(IPlaceRepository _placeRepository) : IPlaceService
{
    public async Task<TResult> GetByIdAsync(Guid id)
    {
        var place = await _placeRepository.FindAsync(id);
        if (place is null) return TResult.Failed("Place not found!");
        return TResult.Ok(new
        {
            place.Id,
            place.Content,
            place.StreetId,
            place.Address
        });
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
