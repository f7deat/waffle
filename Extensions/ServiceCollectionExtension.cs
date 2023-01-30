using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services;
using Waffle.Core.Services.AppSettings;

namespace Waffle.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IAppSettingService, AppSettingService>();
            services.AddScoped<ICatalogService, CatalogService>();
            services.AddScoped<IComponentService, ComponentService>();
            services.AddScoped<IFileExplorerService, FileExplorerService>();
            services.AddScoped<ILocalizationService, LocalizationService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IWorkService, WorkService>();
        }
    }
}
