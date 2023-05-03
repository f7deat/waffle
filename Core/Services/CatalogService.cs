using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        public async Task<IdentityResult> AddAsync(Catalog catalog)
        {
            if (catalog is null || string.IsNullOrWhiteSpace(catalog.Name))
            {
                return IdentityResult.Failed(new IdentityError {
                    Description = "Name can not empty!"
                });
            }
            if (string.IsNullOrEmpty(catalog.NormalizedName))
            {
                catalog.NormalizedName = SeoHelper.ToSeoFriendly(catalog.Name);
            }
            if (await IsExistAsync(catalog))
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Data exist!"
                });
            }
            catalog.CreatedDate = DateTime.Now;
            catalog.ModifiedDate = DateTime.Now;
            await _context.Catalogs.AddAsync(catalog);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<Catalog> EnsureDataAsync(string name, CatalogType type = CatalogType.Default)
        {
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(name));
            if (catalog is null)
            {
                catalog = new Catalog
                {
                    Name = name,
                    NormalizedName = name,
                    Active = true,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    Type = type,
                    ViewCount = 0
                };
                await _context.Catalogs.AddAsync(catalog);
            }
            catalog.ViewCount++;
            await _context.SaveChangesAsync();
            return catalog;
        }

        public async Task<Catalog?> GetByNameAsync(string? normalizedName)
        {
            if (string.IsNullOrEmpty(normalizedName))
            {
                return default;
            }
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName) && x.Active);
            if (catalog is null)
            {
                return default;
            }
            catalog.ViewCount++;
            await _context.SaveChangesAsync();
            return catalog;
        }

        public async Task<List<ComponentListItem>> ListComponentAsync(Guid catalogId)
        {
            var query = from a in _context.WorkContents
                        join b in _context.WorkItems on a.Id equals b.WorkId
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
            article.Thumbnail = args.Thumbnail;
            article.Name = args.Name;
            article.NormalizedName = normalizedName;
            article.Description = args.Description;
            article.Active = args.Active;
            article.Type = CatalogType.Article;
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

        public async Task<ListResult<Catalog>> ArticleListAsync(ArticleFilterOptions filterOptions)
        {
            var searchTerm = SeoHelper.ToSeoFriendly(filterOptions.Name);
            var query = _context.Catalogs.Where(x => (string.IsNullOrEmpty(searchTerm) || x.NormalizedName.Contains(searchTerm))
            && x.Type == CatalogType.Article && x.Active).OrderByDescending(x => x.ModifiedDate);
            return await ListResult<Catalog>.Success(query, filterOptions);
        }

        public async Task<Catalog?> FindAsync(Guid id) => await _context.Catalogs.FindAsync(id);

        public async Task<IEnumerable<Catalog>> ArticlePickerListAsync()
        {
            return await _context.Catalogs.Where(x => x.Active && x.Type == CatalogType.Article).OrderBy(x => Guid.NewGuid()).Take(5).ToListAsync();
        }

        public async Task<IdentityResult> SaveAsync(Catalog args)
        {
            var catalog = await _context.Catalogs.FindAsync(args.Id);
            if (catalog is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "catalog.notFound",
                    Description = "Data not found!"
                });
            }
            catalog.Name = args.Name;
            catalog.NormalizedName = args.NormalizedName;
            catalog.Type = args.Type;
            catalog.Active = args.Active;
            catalog.ModifiedDate = DateTime.Now;
            catalog.Description = args.Description;
            catalog.Thumbnail = args.Thumbnail;
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public IEnumerable<Option> GetTypes()
        {
            var values = Enum.GetValues(typeof(CatalogType));
            foreach (var item in values)
            {
                yield return new Option
                {
                    Value = item.GetHashCode().ToString(),
                    Label = item.ToString()
                };
            }
        }

        public async Task<WorkContent?> FirstWorkAsync(Guid id)
        {
            var query = from a in _context.WorkItems
                        join b in _context.WorkContents on a.WorkId equals b.Id
                        where a.CatalogId == id
                        select b;
            return await query.FirstOrDefaultAsync();
        }

        public Task<ListResult<Catalog>> ListAsync(CatalogFilterOptions filterOptions)
        {
            var name = SeoHelper.ToSeoFriendly(filterOptions.Name);
            var query = _context.Catalogs.Where(x => (filterOptions.Type == null || x.Type == filterOptions.Type) &&
            (string.IsNullOrEmpty(name) || x.NormalizedName.Contains(name)) &&
            (filterOptions.Active == null || x.Active == filterOptions.Active)).OrderByDescending(x => x.ModifiedDate);
            return ListResult<Catalog>.Success(query, filterOptions);
        }

        public async Task<ListResult<Catalog>> ArticleRelatedListAsync(ArticleRelatedFilterOption filterOption)
        {
            var query = from a in _context.WorkItems
                        join b in _context.Catalogs on a.WorkId equals b.Id
                        where b.Active && a.CatalogId == filterOption.CatalogId && b.Type == CatalogType.Article && b.Id != filterOption.WorkId
                        select b;
            return await ListResult<Catalog>.Success(query, filterOption);
        }

        public async Task<List<Catalog>> ListTagByIdAsync(Guid catalogId)
        {
            var query = from a in _context.WorkItems
                        join b in _context.Catalogs on a.CatalogId equals b.Id
                        where b.Active && a.WorkId == catalogId && b.Type == CatalogType.Tag
                        orderby a.SortOrder ascending
                        select b;
            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Option>> ListTagSelectAsync(TagFilterOptions filterOptions)
        {
            var normalizedName = SeoHelper.ToSeoFriendly(filterOptions.KeyWords);
            return await _context.Catalogs.Where(x =>
            x.Active && x.Type == CatalogType.Tag && (string.IsNullOrEmpty(normalizedName) || x.NormalizedName.Contains(normalizedName)))
                .Select(x => new Option
                {
                    Label = x.Name,
                    Value = x.Id
                }).ToListAsync();
        }

        public async Task<IdentityResult> TagAddToCatalogAsync(WorkItem args)
        {
            var tag = await _context.Catalogs.FindAsync(args.CatalogId);
            if (tag is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Tag not found!"
                });
            }
            var catalog = await _context.Catalogs.FindAsync(args.WorkId);
            if (catalog is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Catalog not found!"
                });
            }
            await _context.WorkItems.AddAsync(args);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<ListResult<Catalog>> ListByTagAsync(Guid tagId, CatalogFilterOptions filterOptions)
        {
            var searchTerm = SeoHelper.ToSeoFriendly(filterOptions.Name);
            var query = from a in _context.WorkItems
                        join b in _context.Catalogs on a.WorkId equals b.Id
                        where a.CatalogId == tagId && b.Active &&
                        (string.IsNullOrEmpty(searchTerm) || b.NormalizedName.Contains(searchTerm)) &&
                        (filterOptions.Type == null || b.Type == filterOptions.Type)
                        orderby b.ModifiedDate descending
                        select b;
            return await ListResult<Catalog>.Success(query, filterOptions);
        }

        public async Task<IEnumerable<Catalog>> ListRandomTagAsync() => await _context.Catalogs.Where(x => x.Type == CatalogType.Tag && x.Active).OrderBy(x => Guid.NewGuid()).Take(10).ToListAsync();

        public async Task<ListResult<TagListItem>> ListTagAsync(IFilterOptions filterOptions)
        {
            var query = _context.Catalogs.Where(x => x.Type == CatalogType.Tag && x.Active).Select(x => new TagListItem
            {
                Id = x.Id,
                Name = x.Name,
                NormalizedName = x.NormalizedName,
                ViewCount = x.ViewCount,
                PostCount = _context.WorkItems.Count(y => y.CatalogId == x.Id)
            }).OrderByDescending(x => x.Id);
            return await ListResult<TagListItem>.Success(query, filterOptions);
        }

        public async Task<object?> PieChartAsync()
        {
            return await _context.Catalogs.GroupBy(x => x.Type).Select(x => new
            {
                label = x.Key.ToString(),
                value = x.Count()
            }).ToListAsync();
        }
    }
}
