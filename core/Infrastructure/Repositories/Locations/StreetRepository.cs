using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.IRepositories;
using Waffle.Data;
using Waffle.Entities.Locations;

namespace Waffle.Infrastructure.Repositories.Locations;

public class StreetRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Street>(context, hcaService), IStreetRepository
{
}
