using Microsoft.AspNetCore.Identity.UI.Services;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Senders;
using Waffle.Core.Services;
using Waffle.Core.Services.AppSettings;
using Waffle.Infrastructure.Repositories;

namespace Waffle.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddScoped<IAppSettingService, AppSettingService>();
            services.AddScoped<ICatalogService, CatalogService>();
            services.AddScoped<IComponentService, ComponentService>();
            services.AddScoped<IFileExplorerService, FileExplorerService>();
            services.AddScoped<ILocalizationService, LocalizationService>();
            services.AddScoped<ILocalizationRepository, LocalizationRepository>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IWorkService, WorkService>();
        }
    }
}
