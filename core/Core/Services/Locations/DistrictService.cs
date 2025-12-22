using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.Services.Locations;

public class DistrictService(IDistrictRepository _districtRepository) : IDistrictService
{
    public async Task<TResult> CreateAsync(District args)
    {
        await _districtRepository.AddAsync(new District
        {
            Name = args.Name,
            ProvinceId = args.ProvinceId
        });
        return TResult.Success;
    }

    public async Task<TResult> GetByIdAsync(int id)
    {
        var district = await _districtRepository.FindAsync(id);
        if (district == null) return TResult.Failed("District not found.");
        return TResult.Ok(new
        {
            district.Id,
            district.Name,
            district.ProvinceId
        });
    }

    public Task<object> GetOptionsAsync(DistrictSelectOptions filterOptions) => _districtRepository.GetOptionsAsync(filterOptions);

    public Task<ListResult> ListAsync(DistrictFilterOptions filterOptions) => _districtRepository.ListAsync(filterOptions);
}
