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
    }
}