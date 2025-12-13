using Waffle.Core.Foundations.Models;
using Waffle.Entities.Locations;

namespace Waffle.Core.IServices.Locations;

public interface ICountryService
{
    Task<TResult> CreateAsync(Country args);
}
