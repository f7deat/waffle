using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;

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

    public Task<object> GetOptionsAsync(DistrictSelectOptions filterOptions) => _districtRepository.GetOptionsAsync(filterOptions);
}
