using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;

namespace Waffle.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public virtual DbSet<AppLog> AppLogs { get; set; } = default!;
    public virtual DbSet<AppSetting> AppSettings { get; set; } = default!;
    public virtual DbSet<Catalog> Catalogs { get; set; } = default!;
    public virtual DbSet<Comment> Comments { get; set; } = default!;
    public virtual DbSet<Component> Components { get; set; } = default!;
    public virtual DbSet<FileContent> FileContents { get; set; } = default!;
    public virtual DbSet<WorkContent> WorkContents { get; set; } = default!;
    public virtual DbSet<WorkItem> WorkItems { get; set; } = default!;
    public virtual DbSet<Contact> Contacts { get; set; } = default!;
    public virtual DbSet<Localization> Localizations { get; set; } = default!;
    public virtual DbSet<Order> Orders { get; set; } = default!;
    public virtual DbSet<OrderDetail> OrderDetails { get; set; } = default!;
    public virtual DbSet<Product> Products { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Localization>().HasIndex(l => new { l.Language, l.Key }).HasDatabaseName("idx_Localizations_Language_Key");
        builder.Entity<Catalog>().HasIndex(c => c.Id).HasDatabaseName("IDX_Catalog_Id");
        builder.Entity<WorkItem>().HasIndex(w => w.CatalogId).HasDatabaseName("IDX_WorkItem_CatalogId");
        builder.Entity<WorkItem>().HasIndex(w => w.WorkId).HasDatabaseName("IDX_WorkItem_WorkId");
        builder.Entity<WorkContent>().HasIndex(wc => wc.Id).HasDatabaseName("IDX_WorkContent_Id");

        builder.Entity<WorkItem>().HasKey(k => new { k.WorkId, k.CatalogId });
        base.OnModelCreating(builder);
    }
}