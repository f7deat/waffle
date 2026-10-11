using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.ViewModels.Brands;

namespace Waffle.Core.Services.Brands;

public class BrandService(IBrandRepository brandRepository) : IBrandService
{
    public Task<ListResult<BrandListItem>> ListAsync(BrandFilterOptions filterOptions, bool activeOnly)
        => brandRepository.ListAsync(filterOptions, activeOnly);

    public Task<IEnumerable<object>> OptionsAsync(string? keywords)
        => brandRepository.OptionsAsync(keywords);

    public async Task<TResult> GetByNameAsync(string normalizedName)
    {
        var brand = await brandRepository.GetActiveByNormalizedNameAsync(SeoHelper.ToSeoFriendly(normalizedName));
        return brand is null ? TResult.Failed("Brand not found!") : TResult.Ok(brand);
    }

    public async Task<TResult> CreateAsync(SaveBrandRequest request)
    {
        var normalizedName = SeoHelper.ToSeoFriendly(request.Name);
        if (string.IsNullOrWhiteSpace(normalizedName)) return TResult.Failed("Brand name is required!");
        if (await brandRepository.IsNameTakenAsync(normalizedName, 0))
            return TResult.Failed("Brand with the same name already exists!");

        await brandRepository.AddAsync(new Brand
        {
            Name = request.Name.Trim(),
            NormalizedName = normalizedName,
            Description = request.Description,
            Logo = request.Logo,
            IsActive = request.IsActive
        });
        return TResult.Success;
    }

    public async Task<TResult> UpdateAsync(SaveBrandRequest request)
    {
        var brand = await brandRepository.FindAsync(request.Id);
        if (brand is null || brand.DeletedAt.HasValue) return TResult.Failed("Brand not found!");

        var normalizedName = SeoHelper.ToSeoFriendly(request.Name);
        if (string.IsNullOrWhiteSpace(normalizedName)) return TResult.Failed("Brand name is required!");
        if (await brandRepository.IsNameTakenAsync(normalizedName, brand.Id))
            return TResult.Failed("Brand with the same name already exists!");

        brand.Name = request.Name.Trim();
        brand.NormalizedName = normalizedName;
        brand.Description = request.Description;
        brand.Logo = request.Logo;
        brand.IsActive = request.IsActive;
        await brandRepository.UpdateAsync(brand);
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(int id)
    {
        var brand = await brandRepository.FindAsync(id);
        if (brand is null || brand.DeletedAt.HasValue) return TResult.Failed("Brand not found!");

        brand.DeletedAt = DateTime.UtcNow;
        await brandRepository.UpdateAsync(brand);
        return TResult.Success;
    }
}
