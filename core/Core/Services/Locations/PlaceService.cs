using System.Text.Json;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IRepositories;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Args;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Services.Locations;

public class PlaceService(IPlaceRepository _placeRepository, IProvinceRepository _provinceRepository, IStreetRepository _streetRepository, IDistrictRepository _districtRepository, ICatalogService _catalogService) : IPlaceService
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
        var district = new District();
        var street = new Street();
        var province = new Province();
        if (place.StreetId.HasValue)
        {
            street = await _streetRepository.FindAsync(place.StreetId);
            if (street != null)
            {
                district = await _districtRepository.FindAsync(street.DistrictId);
                if (district != null)
                {
                    province = await _provinceRepository.FindAsync(district.Id);
                }
            }
        }
        return TResult.Ok(new
        {
            place.Id,
            content,
            place.StreetId,
            place.Address,
            StreetName = street?.Name,
            DistrictId = district?.Id,
            DistrictName = district?.Name,
            ProvinceId = province?.Id,
            ProvinceName = province?.Name
        });
    }

    public async Task<TResult> GetByNormalizedNameAsync(string normalizedName)
    {
        var catalog = await _catalogService.GetByNameAsync(normalizedName);
        if (catalog is null) return TResult.Failed("Catalog not found!");
        var place = await _placeRepository.FindAsync(catalog.Id);
        if (place is null) return TResult.Failed("Place not found!");
        var images = await _placeRepository.GetImagesAsync(catalog.Id);
        var district = new District();
        var street = new Street();
        var province = new Province();
        if (place.StreetId.HasValue)
        {
            street = await _streetRepository.FindAsync(place.StreetId);
            if (street != null)
            {
                district = await _districtRepository.FindAsync(street.DistrictId);
                if (district != null)
                {
                    province = await _provinceRepository.FindAsync(district.Id);
                }
            }
        }
        return TResult.Ok(new
        {
            catalog.Id,
            catalog.Name,
            catalog.NormalizedName,
            catalog.Description,
            catalog.Thumbnail,
            catalog.ModifiedDate,
            catalog.CreatedDate,
            catalog.ViewCount,
            place.Address,
            place.StreetId,
            Content = string.IsNullOrEmpty(place.Content) ? new BlockEditor() : JsonSerializer.Deserialize<BlockEditor>(place.Content),
            Images = images.Select(x => new
            {
                x.Id,
                x.Url,
                x.UploadedAt
            }),
            StreetName = street?.Name,
            DistrictId = district?.Id,
            DistrictName = district?.Name,
            ProvinceId = province?.Id,
            ProvinceName = province?.Name
        });
    }

    public Task<ListResult> GetRandomAsync(PlaceFilterOptions filterOptions) => _placeRepository.GetRandomAsync(filterOptions);

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
