using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;
using Waffle.Entities.Affliates;
using Waffle.Entities.Careers;
using Waffle.Entities.Ecommerces;
using Waffle.Entities.Files;
using Waffle.Entities.Locations;
using Waffle.Entities.Notifications;
using Waffle.Entities.Tags;
using Waffle.Entities.Users;

namespace Waffle.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>(options)
{
    public DbSet<AppLog> AppLogs { get; set; } = default!;
    public DbSet<AppSetting> AppSettings { get; set; } = default!;
    public DbSet<Catalog> Catalogs { get; set; } = default!;
    public DbSet<Comment> Comments { get; set; } = default!;
    public DbSet<Component> Components { get; set; } = default!;
    public DbSet<FileContent> FileContents { get; set; } = default!;
    public DbSet<WorkContent> WorkContents { get; set; } = default!;
    public DbSet<WorkItem> WorkItems { get; set; } = default!;
    public DbSet<Contact> Contacts { get; set; } = default!;
    public DbSet<Localization> Localizations { get; set; } = default!;
    public DbSet<Order> Orders { get; set; } = default!;
    public DbSet<OrderDetail> OrderDetails { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Menu> Menus { get; set; }
    public DbSet<Folder> Folders { get; set; }
    public DbSet<ProductLink> ProductLinks { get; set; }
    public DbSet<AffiliateLink> AffiliateLinks { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Collection> Collections { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<TagCatalog> TagCatalogs { get; set; }
    #region Job
    public DbSet<JobOpportunity> JobOpportunities { get; set; } = default!;
    public DbSet<JobApplication> JobApplications { get; set; } = default!;
    #endregion

    #region Notifications
    public DbSet<Notification> Notifications { get; set; } = default!;
    public DbSet<NotificationUser> NotificationUsers { get; set; } = default!;
    #endregion

    #region Locations
    public DbSet<Country> Countries { get; set; }
    public DbSet<Province> Provinces { get; set; }
    public DbSet<District> Districts { get; set; }
    public DbSet<Street> Streets { get; set; }
    public DbSet<Place> Places { get; set; }
    public DbSet<PlaceImage> PlaceImages { get; set; }
    #endregion

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Localization>().HasIndex(l => new { l.Language, l.Key }).HasDatabaseName("idx_Localizations_Language_Key");
        builder.Entity<Catalog>().HasIndex(c => c.Id).HasDatabaseName("IDX_Catalog_Id");
        builder.Entity<WorkItem>().HasIndex(w => w.CatalogId).HasDatabaseName("IDX_WorkItem_CatalogId");
        builder.Entity<WorkItem>().HasIndex(w => w.WorkId).HasDatabaseName("IDX_WorkItem_WorkId");
        builder.Entity<WorkContent>().HasIndex(wc => wc.Id).HasDatabaseName("IDX_WorkContent_Id");

        builder.Entity<WorkItem>().HasKey(k => new { k.WorkId, k.CatalogId });
        builder.Entity<Collection>().HasKey(k => new { k.CatalogId, k.CollectionId });
        builder.Entity<NotificationUser>().HasKey(k => new { k.NotificationId, k.UserId });
        builder.Entity<TagCatalog>().HasKey(tc => new { tc.CatalogId, tc.TagId });

        base.OnModelCreating(builder);
    }
}