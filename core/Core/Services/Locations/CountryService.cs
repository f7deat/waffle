using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.Locations;
using Waffle.Entities.Locations;
using Waffle.Models;

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

    public async Task<TResult> GetByIdAsync(int id)
    {
        var country = await _countryRepository.FindAsync(id);
        if (country is null) return TResult.Failed("Country not found!");
        return TResult.Ok(new
        {
            country.Id,
            country.Name
        });
    }

    public Task<ListResult> GetListAsync(FilterOptions filterOptions) => _countryRepository.GetListAsync(filterOptions);
}
