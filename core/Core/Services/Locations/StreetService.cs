using Waffle.Core.Foundations.Models;
using Waffle.Core.IRepositories;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.Services.Locations;

public class StreetService(IStreetRepository _streetRepository) : IStreetService
{
    public async Task<TResult> CreateAsync(Street args)
    {
        if (await _streetRepository.IsExistAsync(args.DistrictId, args.Name)) return TResult.DuplicateRecord;
        await _streetRepository.AddAsync(new Street
        {
            DistrictId = args.DistrictId,
            Name = args.Name
        });
        return TResult.Success;
    }

    public Task<ListResult> GetListAsync(StreetFilterOptions filterOptions) => _streetRepository.GetListAsync(filterOptions);

    public Task<object> GetOptionsAsync(StreetSelectOptions selectOptions) => _streetRepository.GetOptionsAsync(selectOptions);
}
