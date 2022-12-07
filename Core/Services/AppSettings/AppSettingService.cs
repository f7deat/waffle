using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Core.Services.AppSettings
{
    public class AppSettingService : IAppSettingService
    {
        private readonly ApplicationDbContext _context;
        public AppSettingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AppSetting> EnsureSettingAsync(string name)
        {
            var appSetting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.Equals(name));
            if (appSetting is null)
            {
                appSetting = new AppSetting
                {
                    Name = name,
                    NormalizedName = name,
                    Value = string.Empty
                };
                await _context.AppSettings.AddAsync(appSetting);
                await _context.SaveChangesAsync();
            }
            return appSetting;
        }
    }
}
