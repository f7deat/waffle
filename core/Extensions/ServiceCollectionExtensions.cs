using Microsoft.AspNetCore.Identity.UI.Services;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IRepository.Catalogs;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Senders;
using Waffle.Core.Services;
using Waffle.Core.Services.Affiliates;
using Waffle.Core.Services.Careers;
using Waffle.Core.Services.Contacts;
using Waffle.Core.Services.Ecommerces;
using Waffle.Core.Services.Files;
using Waffle.Data.ContentGenerators;
using Waffle.Infrastructure.Repositories;
using Waffle.Infrastructure.Repositories.Catalogs;

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
        services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
        services.AddScoped<ISettingRepository, SettingRepository>();
        services.AddScoped<IMigrationService, MigrationService>();
        services.AddScoped<IFolderService, FolderService>();
        services.AddScoped<IMenuService, MenuService>();
        services.AddScoped<IRoomService, RoomService>();
        services.AddScoped<ICityService, CityService>();

        #region Products
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IProductService, ProductService>();

        services.AddScoped<IProductLinkRepository, ProductLinkRepository>();

        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IOrderService, OrderSerivce>();
        #endregion

        #region Affiliates
        services.AddScoped<IAffiliateService, AffiliateService>();
        #endregion

        #region Careers
        services.AddScoped<IJobOpportunityService, JobOpportunityService>();
        #endregion

        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<IRouteDataService, RouteDataService>();

        services.AddScoped<ICollectionService, CollectionService>();
        services.AddScoped<ICollectionRepository, CollectionRepository>();

        services.AddScoped<IGenerator, LeafGenerator>();
        services.AddScoped<IGenerator, ComponentGenerator>();
        services.AddScoped<IGenerator, RoleGenerator>();

        #region Notification
        services.AddScoped<INotificationService, NotificationService>();
        #endregion
    }
}
