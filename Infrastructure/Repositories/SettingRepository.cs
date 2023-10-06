using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories;

public class SettingRepository : EfRepository<AppSetting>, ISettingRepository
{
    public SettingRepository(ApplicationDbContext context) : base(context)
    {
    }
}
