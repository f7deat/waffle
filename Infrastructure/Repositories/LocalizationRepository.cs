using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories
{
    public class LocalizationRepository : EfRepository<Localization>, ILocalizationRepository
    {
        public LocalizationRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
