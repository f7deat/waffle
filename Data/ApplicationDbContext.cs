using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;
using Waffle.Models.Components;
using Waffle.ViewComponents;

namespace Waffle.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Catalog> Catalogs { get; set; }
        public DbSet<Component> Components { get; set; }
        public DbSet<WorkItem> WorkItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Catalog>().HasData(new Catalog { Id = Guid.Parse("06d5c4c9-18a6-49eb-a821-ed208631945e"), Name = "Home", NormalizedName = "home", Active = true });
            builder.Entity<Catalog>().HasData(new Catalog { Id = Guid.Parse("4881c283-ef77-48c1-ab4e-646b61dabf4c"), Name = "Blog", NormalizedName = "blog", Active = true });
            builder.Entity<Catalog>().HasData(new Catalog { Id = Guid.Parse("05c94032-84e5-47d5-99d7-30edb28a51bd"), Name = "Setting", NormalizedName = "setting", Active = true });
            builder.Entity<Catalog>().HasData(new Catalog { Id = Guid.Parse("4473a4f2-e9c0-4db1-9558-fd99c489a3fa"), Name = "CSS", NormalizedName = "css", Active = true, ParentId = Guid.Parse("05c94032-84e5-47d5-99d7-30edb28a51bd") });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("b46dc729-7681-42c0-a7cb-97d0addde826"), Name = nameof(Title), NormalizedName = nameof(Title) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("2b803a7c-dc1b-4db1-9a09-aebfdef0ad1b"), Name = nameof(Html), NormalizedName = nameof(Html) });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("1ad3c3f7-d3ec-4a08-884d-4bf72c81afcb"), Name = nameof(Css), NormalizedName = nameof(Css) });
        }
    }
}