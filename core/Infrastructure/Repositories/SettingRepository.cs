using Microsoft.EntityFrameworkCore;
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

    public async Task<AppSetting?> FindByNameAsync(string normalizedName)
    {
        if (string.IsNullOrWhiteSpace(normalizedName)) return default;
        normalizedName = normalizedName.ToLower().Trim();
        return await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.ToLower() == normalizedName);
    }
}
