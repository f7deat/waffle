using Waffle.Controllers;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;

namespace Waffle.Infrastructure.Repositories;

public class AppLogRepository : EfRepository<AppLog>, IAppLogRepository
{
    public AppLogRepository(ApplicationDbContext context) : base(context)
    {
    }
}
