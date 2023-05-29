using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;

namespace Waffle.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public virtual DbSet<Catalog> Catalogs { get; set; } = null!;
        public virtual DbSet<Component> Components { get; set; } = null!;
        public virtual DbSet<FileContent> FileContents { get; set; } = null!;
        public virtual DbSet<WorkContent> WorkContents { get; set; } = null!;
        public virtual DbSet<WorkItem> WorkItems { get; set; } = null!;
        public virtual DbSet<AppSetting> AppSettings { get; set; } = null!;
        public virtual DbSet<Contact> Contacts { get; set; } = null!;
        public virtual DbSet<Localization> Localizations { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<WorkItem>().HasKey(k => new { k.WorkId, k.CatalogId });
        }
    }
}