using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.Core.Services.Catalogs
{
    public class CatalogService : ICatalogService
    {
        private readonly ApplicationDbContext _context;
        public CatalogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Catalog> EnsureDataAsync(string name)
        {
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(name));
            if (catalog is null)
            {
                catalog = new Catalog
                {
                    Name = name,
                    NormalizedName = name,
                    Active = true
                };
                await _context.Catalogs.AddAsync(catalog);
                await _context.SaveChangesAsync();
            }
            return catalog;
        }
    }
}
