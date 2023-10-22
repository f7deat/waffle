using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Senders;
using Waffle.Core.Services;
using Waffle.Core.Services.Ecommerces;
using Waffle.Data.ContentGenerators;
using Waffle.Infrastructure.Repositories;

namespace Waffle.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddServices(this IServiceCollection services)
    {
        services.AddTransient<IEmailSender, EmailSender>();
        services.AddScoped<ISettingService, SettingService>();
        services.AddScoped<ILogRepository, LogRepository>();
        services.AddScoped<ILogService, LogService>();
        services.AddScoped<ICatalogRepository, CatalogRepository>();
        services.AddScoped<ICatalogService, CatalogService>();
        services.AddScoped<IContactRepository, ContactRepository>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<IComponentRepository, ComponentRepository>();
        services.AddScoped<IComponentService, ComponentService>();
        services.AddScoped<IFileService, FileExplorerService>();
        services.AddScoped<ILocalizationService, LocalizationService>();
        services.AddScoped<ILocalizationRepository, LocalizationRepository>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IWorkService, WorkService>();
        services.AddScoped<IWorkContentRepository, WorkItemRepository>();
        services.AddScoped<IFileRepository, FileRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IOrderService, OrderSerivce>();
        services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ISettingRepository, SettingRepository>();
        services.AddScoped<IMigrationService, MigrationService>();

        services.AddScoped<ICurrentUser, CurrentUser>();

        services.AddScoped<IGenerator, LeafGenerator>();
        services.AddScoped<IGenerator, ComponentGenerator>();
    }
}
