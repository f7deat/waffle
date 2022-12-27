using Waffle.Core.Interfaces.IServices;
using Waffle.Core.Services;
using Waffle.Core.Services.AppSettings;
using Waffle.Core.Services.FileContents;

namespace Waffle.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IAppSettingService, AppSettingService>();
            services.AddScoped<ICatalogService, CatalogService>();
            services.AddScoped<IComponentService, ComponentService>();
            services.AddScoped<IFileContentService, FileContentService>();
            services.AddScoped<IFileExplorerService, FileExplorerService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IWorkService, WorkService>();
        }
    }
}
