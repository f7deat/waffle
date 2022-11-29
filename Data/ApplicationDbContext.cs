using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
            : base(options)
        {
        }

        public virtual DbSet<Catalog> Catalogs { get; set; }
        public virtual DbSet<Component> Components { get; set; }
        public virtual DbSet<FileContent> FileContents { get; set; }
        public virtual DbSet<FileItem> FileItems { get; set; }
        public virtual DbSet<WorkContent> WorkContents { get; set; }
        public virtual DbSet<WorkItem> WorkItems { get; set; }
        public virtual DbSet<AppSetting> AppSettings { get; set; }
        public virtual DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<FileItem>().HasKey(k => new { k.FileId, k.ItemId });
            builder.Entity<WorkItem>().HasKey(k => new { k.WorkContentId, k.CatalogId });

            builder.Entity<AppSetting>().HasData(new AppSetting { Id = new Guid("21676da7-44f5-428b-831b-d29d882bbac1"), Name = "SendGrid", NormalizedName = "SendGrid" });

            builder.Entity<Catalog>().HasData(new Catalog { Id = Guid.Parse("05c94032-84e5-47d5-99d7-30edb28a51bd"), Name = "Setting", NormalizedName = "setting", Active = true });
            builder.Entity<Catalog>().HasData(new Catalog { Id = Guid.Parse("1b0c4f08-7dfa-43f6-aed9-74756a1fbbcc"), Name = nameof(Header), NormalizedName = nameof(Header), Active = true, ParentId = Guid.Parse("05c94032-84e5-47d5-99d7-30edb28a51bd") });

            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("b46dc729-7681-42c0-a7cb-97d0addde826"), Name = nameof(Title), NormalizedName = nameof(Title) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("2b803a7c-dc1b-4db1-9a09-aebfdef0ad1b"), Name = nameof(Html), NormalizedName = nameof(Html) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("1ad3c3f7-d3ec-4a08-884d-4bf72c81afcb"), Name = nameof(Css), NormalizedName = nameof(Css) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("4efd4b8b-aa05-40b0-91f2-616b04d4f99b"), Name = nameof(Header), NormalizedName = nameof(Header) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("f1aadc42-0c3e-4cec-b16a-55acb1409ec1"), Name = nameof(Row), NormalizedName = nameof(Row) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("7cb9c10d-9cf4-4c7f-a0ef-ef0fe74c37fb"), Name = nameof(Column), NormalizedName = nameof(Column) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("30520f7f-e3e8-412a-ac97-936be9e8de2c"), Name = nameof(Image), NormalizedName = nameof(Image) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("76f17e16-db02-4104-8e77-20e07dbae433"), Name = nameof(Navbar), NormalizedName = nameof(Navbar) });
        }
    }
}