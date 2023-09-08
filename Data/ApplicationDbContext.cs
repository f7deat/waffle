using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;

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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<WorkItem>().HasKey(k => new { k.WorkId, k.CatalogId });
    }
}