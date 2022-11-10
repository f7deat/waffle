using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

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

        public async Task<PageVewModel> GetPageDataAsync(Catalog catalog)
        {
            var workItems = from a in _context.WorkItems
                            join b in _context.WorkContents on a.WorkContentId equals b.Id
                            join c in _context.Components on b.ComponentId equals c.Id
                            where a.CatalogId == catalog.Id
                            orderby a.SortOrder ascending
                            select new ComponentListItem
                            {
                                Id = a.WorkContentId,
                                Name = c.NormalizedName
                            };

            var settings = new CatalogSetting();
            if (!string.IsNullOrEmpty(catalog.Setting))
            {
                settings = JsonSerializer.Deserialize<CatalogSetting>(catalog.Setting) ?? new CatalogSetting();
            }

            return new PageVewModel
            {
                ComponentListItems = await workItems.ToListAsync(),
                Settings = settings
            };
        }
    }
}
