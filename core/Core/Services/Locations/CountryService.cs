using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.Locations;
using Waffle.Entities.Locations;

namespace Waffle.Core.Services.Locations;

public class CountryService(ICountryRepository _countryRepository) : ICountryService
{
    public async Task<TResult> CreateAsync(Country args)
    {
        await _countryRepository.AddAsync(new Country
        {
            Name = args.Name
        });
        return TResult.Success;
    }
}
