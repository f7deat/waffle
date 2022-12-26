using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IServices;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Services
{
    public class CatalogService : ICatalogService
    {
        private readonly ApplicationDbContext _context;
        public CatalogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IdentityResult> ActiveAsync(Guid id)
        {
            var catalog = await _context.Catalogs.FindAsync(id);
            if (catalog is null)
            {
                return IdentityResult.Failed();
            }
            catalog.Active = !catalog.Active;
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<PayloadResult<Catalog>> AddAsync(Catalog catalog)
        {
            if (catalog is null || string.IsNullOrWhiteSpace(catalog.Name))
            {
                return PayloadResult<Catalog>.Failed(new IdentityError { });
            }
            if (string.IsNullOrEmpty(catalog.NormalizedName))
            {
                catalog.NormalizedName = SeoHelper.ToSeoFriendly(catalog.Name);
            }
            if (await _context.Catalogs.AnyAsync(x => x.NormalizedName.Equals(catalog.NormalizedName) && x.Type == catalog.Type))
            {
                return PayloadResult<Catalog>.Failed(new IdentityError
                {
                    Description = "Data exist!"
                });
            }
            catalog.CreatedDate = DateTime.Now;
            catalog.ModifiedDate = DateTime.Now;
            await _context.Catalogs.AddAsync(catalog);
            await _context.SaveChangesAsync();
            return PayloadResult<Catalog>.Payload(catalog);
        }

        public async Task<Catalog> EnsureDataAsync(string name)
        {
            var catalog = await _context.Catalogs.AsNoTracking().FirstOrDefaultAsync(x => x.NormalizedName.Equals(name));
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

        public async Task<Catalog?> GetByNameAsync(string normalizedName) => await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName));

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
