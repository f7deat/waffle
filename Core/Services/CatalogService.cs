using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;
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

        private async Task<bool> IsExistAsync(Catalog catalog) => await _context.Catalogs.AnyAsync(x => x.NormalizedName.Equals(catalog.NormalizedName) && x.Type == catalog.Type);

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
            if (await IsExistAsync(catalog))
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
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(name));
            if (catalog is null)
            {
                catalog = new Catalog
                {
                    Name = name,
                    NormalizedName = name,
                    Active = true,
                    CreatedDate = DateTime.Now
                };
                await _context.Catalogs.AddAsync(catalog);
                await _context.SaveChangesAsync();
            }
            return catalog;
        }

        public async Task<Catalog?> GetByNameAsync(string normalizedName) => await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName));

        public async Task<IEnumerable<ComponentListItem>> GetFooterAsync()
        {
            var catalog = await EnsureDataAsync(nameof(Footer));
            return await ListComponentAsync(catalog.Id);
        }

        public async Task<IEnumerable<ComponentListItem>> GetHeaderAsync()
        {
            var catalog = await EnsureDataAsync(nameof(Header));
            return await ListComponentAsync(catalog.Id);
        }

        public async Task<IEnumerable<ComponentListItem>> ListComponentAsync(Guid catalogId)
        {
            var query = from a in _context.WorkContents
                        join b in _context.WorkItems on a.Id equals b.WorkContentId
                        join c in _context.Components on a.ComponentId equals c.Id
                        where b.CatalogId == catalogId
                        orderby b.SortOrder ascending
                        select new ComponentListItem
                        {
                            Name = c.NormalizedName,
                            Id = a.Id
                        };
            return await query.ToListAsync();
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
                Id = catalog.Id,
                ComponentListItems = await workItems.ToListAsync(),
                Settings = settings
            };
        }

        public async Task<IdentityResult> ArticleSaveAsync(Catalog args)
        {
            var article = await _context.Catalogs.FindAsync(args.Id);
            if (article is null)
            {
                return IdentityResult.Failed();
            }
            var normalizedName = SeoHelper.ToSeoFriendly(args.Name);
            if (await IsExistAsync(args) && !article.NormalizedName.Equals(args))
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Article existed!"
                });
            }
            article.Name = args.Name;
            article.NormalizedName = normalizedName;
            article.Description = args.Description;
            article.Active = args.Active;
            article.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> UpdateThumbnailAsync(Catalog args)
        {
            var catalog = await _context.Catalogs.FindAsync(args.Id);
            if (catalog is null)
            {
                return IdentityResult.Failed();
            }
            catalog.Thumbnail = args.Thumbnail;
            catalog.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
    }
}
