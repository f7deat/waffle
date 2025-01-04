﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;
using Waffle.Entities.Affliates;
using Waffle.Entities.Ecommerces;
using Waffle.Entities.Files;
using Waffle.Entities.Locations;

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
    public DbSet<OrderDetail> OrderDetails { get; set; } = default!;
    public DbSet<Product> Products { get; set; } = default!;
    public DbSet<Menu> Menus { get; set; } = default!;
    public DbSet<Folder> Folders { get; set; } = default!;
    public DbSet<ProductLink> ProductLinks { get; set; } = default!;
    public DbSet<AffiliateLink> AffiliateLinks { get; set; } = default!;
    public DbSet<Room> Rooms { get; set; } = default!;
    public DbSet<City> Cities { get; set; } = default!;
    public DbSet<Country> Countries { get; set; } = default!;

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