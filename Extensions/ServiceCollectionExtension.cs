using Waffle.Core.Interfaces.IServices;
using Waffle.Core.Services;
using Waffle.Core.Services.AppSettings;
using Waffle.Core.Services.Catalogs;
using Waffle.Core.Services.FileContents;

namespace Waffle.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddTransient<IAppSettingService, AppSettingService>();
            services.AddTransient<ICatalogService, CatalogService>();
            services.AddTransient<IFileContentService, FileContentService>();
            services.AddTransient<IWorkContentService, WorkContentService>();
            services.AddTransient<IFileExplorerService, FileExplorerService>();
        }
    }
}
