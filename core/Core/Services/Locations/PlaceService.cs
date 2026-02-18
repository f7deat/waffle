using System.Text.Json;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IRepositories;
using Waffle.Core.IServices.Locations;
using Waffle.Core.IServices.Users;
using Waffle.Core.Services.Locations.Args;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Services.Locations;

public class PlaceService(IPlaceRepository _placeRepository, IHCAService _hcaService, IWebHostEnvironment _webHostEnvironment, IProvinceRepository _provinceRepository, IDistrictRepository _districtRepository, ICatalogService _catalogService) : IPlaceService
{
    public async Task<TResult> AddImageAsync(PlaceAddImageArgs args, string host)
    {
        if (args.Images is null || args.Images.Count == 0) return TResult.Failed("No images provided!");
        var place = await _placeRepository.FindAsync(args.PlaceId);
        if (place is null) return TResult.Failed("Place not found!");
        var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "places", place.Id.ToString());
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
        var images = new List<PlaceImage>();
        foreach (var image in args.Images)
        {
            var fileExtension = Path.GetExtension(image.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            var imageUrl = $"{host}/uploads/places/{place.Id}/{fileName}";
            var placeImage = new PlaceImage
            {
                PlaceId = place.Id,
                Url = imageUrl,
                UploadedAt = DateTime.UtcNow
            };
            images.Add(placeImage);
        }
        await _placeRepository.AddImagesAsync(images);
        await _placeRepository.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> DeleteImageAsync(Guid imageId, string host)
    {
        var image = await _placeRepository.GetImageById(imageId);
        if (image is null) return TResult.Failed("Image not found!");
        var uri = new Uri(image.Url);
        var filePath = Path.Combine(_webHostEnvironment.WebRootPath, uri.LocalPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(filePath)) File.Delete(filePath);
        await _placeRepository.DeleteImageAsync(image);
        return TResult.Success;
    }

    public async Task<TResult> GetByIdAsync(Guid id)
    {
        var place = await _placeRepository.FindAsync(id);
        if (place is null)
        {
            var catalog = await _catalogService.FindAsync(id);
            if (catalog is null) return TResult.Failed("Place not found!");
            place = new Place
            {
                Id = catalog.Id,
                Address = string.Empty,
                Content = string.Empty,
                DistrictId = null
            };
            await _placeRepository.AddAsync(place);
        }
        var content = new BlockEditor();
        if (!string.IsNullOrEmpty(place.Content))
        {
            content = JsonSerializer.Deserialize<BlockEditor>(place.Content);
        }
        var district = new District();
        var province = new Province();
        if (place.DistrictId.HasValue)
        {
            district = await _districtRepository.FindAsync(place.DistrictId);
            if (district != null)
            {
                province = await _provinceRepository.FindAsync(district.ProvinceId);
            }
        }
        return TResult.Ok(new
        {
            place.Id,
            content,
            place.DistrictId,
            place.Address,
            DistrictName = district?.Name,
            district?.ProvinceId,
            ProvinceName = province?.Name,
            place.InfluencerId
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
        var province = new Province();
        if (place.DistrictId.HasValue)
        {
            district = await _districtRepository.FindAsync(place.DistrictId);
            if (district != null)
            {
                province = await _provinceRepository.FindAsync(district.ProvinceId);
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
            Content = string.IsNullOrEmpty(place.Content) ? new BlockEditor() : JsonSerializer.Deserialize<BlockEditor>(place.Content),
            Images = images.Select(x => new
            {
                x.Id,
                x.Url,
                x.UploadedAt
            }),
            DistrictId = district?.Id,
            DistrictName = district?.Name,
            ProvinceId = province?.Id,
            ProvinceName = province?.Name,
            Influencer = await _placeRepository.GetInfluencerAsync(place.InfluencerId)
        });
    }

    public async Task<TResult> GetImagesAsync(Guid placeId) => TResult.Ok(await _placeRepository.GetImagesAsync(placeId));

    public Task<ListResult> GetRandomAsync(PlaceFilterOptions filterOptions) => _placeRepository.GetRandomAsync(filterOptions);

    public Task<ListResult> ListAsync(PlaceFilterOptions filterOptions)
    {
        filterOptions.Name = SeoHelper.ToSeoFriendly(filterOptions.Name);
        return _placeRepository.ListAsync(filterOptions);
    }

    public async Task<TResult> UpdateAsync(PlaceUpdateArgs args)
    {
        var place = await _placeRepository.FindAsync(args.Id);
        if (place is null) return TResult.Failed("Place not found!");
        place.Content = args.Content;
        place.DistrictId = args.DistrictId;
        place.Address = args.Address;
        place.InfluencerId = args.InfluencerId;
        var catalog = await _catalogService.FindAsync(place.Id);
        if (catalog is not null)
        {
            catalog.ModifiedDate = DateTime.UtcNow;
            catalog.ModifiedBy = _hcaService.GetUserId();
            await _catalogService.UpdateAsync(catalog);
        }
        await _placeRepository.UpdateAsync(place);
        return TResult.Success;
    }
}
