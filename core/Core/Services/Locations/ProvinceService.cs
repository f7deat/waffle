using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.Services.Locations;

public class ProvinceService(IProvinceRepository _provinceRepository) : IProvinceService
{
    public async Task<TResult> CreateAsync(Province args)
    {
        await _provinceRepository.AddAsync(new Province
        {
            CountryId = args.CountryId,
            Name = args.Name
        });
        return TResult.Success;
    }

    public async Task<TResult> GetByIdAsync(int id)
    {
        var province = await _provinceRepository.FindAsync(id);
        if (province is null) return TResult.Failed("Province not found!");
        return TResult.Ok(new
        {
            province.Id,
            province.Name,
            province.CountryId
        });
    }

    public Task<ListResult> GetListAsync(ProvinceFilterOptions filterOptions) => _provinceRepository.GetListAsync(filterOptions);

    public Task<object> GetOptionsAsync(ProvinceSelectOptions selecOptions) => _provinceRepository.GetOptionsAsync(selecOptions);
}
