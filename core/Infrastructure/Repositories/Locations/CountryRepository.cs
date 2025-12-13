using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities.Locations;

namespace Waffle.Infrastructure.Repositories.Locations;

public class CountryRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Country>(context, hcaService), ICountryRepository
{
}
