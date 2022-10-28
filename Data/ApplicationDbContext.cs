using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;

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
            builder.Entity<Catalog>().HasData(new Catalog { Id = Guid.Parse("4881c283-ef77-48c1-ab4e-646b61dabf4c"), Name = "Blog", NormalizedName = "blog" });
            builder.Entity<Component>().HasData(new Component { Id = Guid.Parse("b46dc729-7681-42c0-a7cb-97d0addde826"), Name = "Title", NormalizedName = "Title" });
        }
    }
}