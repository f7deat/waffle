using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Services
{
    public class WorkService : IWorkService
    {
        private readonly ApplicationDbContext _context;
        private readonly IComponentService _componentService;
        public WorkService(ApplicationDbContext context, IComponentService componentService)
        {
            _context = context;
            _componentService = componentService;
        }

        public async Task<IdentityResult> ActiveAsync(Guid id)
        {
            var workItem = await _context.WorkContents.FindAsync(id);
            if (workItem is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Work item not found!"
                });
            }
            workItem.Active = !workItem.Active;
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> BloggerSaveAsync(Blogger model)
        {
            var work = await _context.WorkContents.FindAsync(model.Id);
            if (work is null)
            {
                return IdentityResult.Failed();
            }
            work.Arguments = JsonSerializer.Serialize(model);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> ColumnAddAsync(Column column)
        {
            var row = await _context.WorkContents.FindAsync(column.RowId);
            if (row is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Row not found!"
                });
            }
            var component = await _componentService.EnsureComponentAsync(nameof(Column));
            var workContent = new WorkContent
            {
                Active = true,
                Arguments = JsonSerializer.Serialize(column),
                Name = column.ClassName,
                ComponentId = component.Id,
                ParentId = column.RowId
            };
            await _context.WorkContents.AddAsync(workContent);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Content not found!"
                });
            }
            _context.WorkContents.Remove(workContent);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<dynamic> ExportByCatalogAsync(Guid catalogId)
        {
            var query = from workItems in _context.WorkItems
                        join workContents in _context.WorkContents on workItems.WorkId equals workContents.Id
                        select new { workItems, workContents };
            return await query.ToListAsync();
        }

        public async Task<WorkContent?> FindAsync(Guid id) => await _context.WorkContents.FindAsync(id);

        public async Task<T?> GetAsync<T>(Guid id)
        {
            var work = await FindAsync(id);
            if (string.IsNullOrEmpty(work?.Arguments))
            {
                return default;
            }
            return JsonSerializer.Deserialize<T>(work.Arguments);
        }

        public async Task<IEnumerable<Option>> GetListAsync(BasicFilterOptions filterOptions)
        {
            var query = from a in _context.Components
                        join b in _context.WorkContents on a.Id equals b.ComponentId
                        select new Option
                        {
                            Label = $"[{a.Name}] {b.Name}",
                            Value = b.Id
                        };
            return await query.ToListAsync();
        }

        public async Task<IdentityResult> ItemAddAsync(WorkItem args)
        {
            if (await _context.WorkItems.AnyAsync(x => x.CatalogId == args.CatalogId && x.WorkId == args.WorkId))
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Dupplicate data"
                });
            }
            await _context.WorkItems.AddAsync(args);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<ListResult<WorkListItem>> GetWorkListItemChildAsync(WorkFilterOptions filterOptions)
        {
            var query = from b in _context.WorkContents
                        join c in _context.Components on b.ComponentId equals c.Id
                        where (filterOptions.ParentId == null || b.ParentId == filterOptions.ParentId) && 
                        (filterOptions.Active == null || b.Active == filterOptions.Active)
                        select new WorkListItem
                        {
                            Id = b.Id,
                            Name = b.Name,
                            NormalizedName = c.NormalizedName,
                            Active = b.Active
                        };
            return await ListResult<WorkListItem>.Success(query, filterOptions);
        }

        public async Task<IdentityResult> NavbarSettingSaveAsync(Navbar args)
        {
            var navbar = await GetAsync<Navbar>(args.Id);
            if (navbar == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Navbar not found"
                });
            }
            navbar.Layout = args.Layout;
            var work = await _context.WorkContents.FindAsync(args.Id);
            if (work == null)
            {
                return IdentityResult.Failed();
            }
            work.Arguments = JsonSerializer.Serialize(navbar);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> SaveColumnAsync(Column item)
        {
            var work = await _context.WorkContents.FindAsync(item.Id);
            if (work is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Work not found!"
                });
            }
            work.Arguments = JsonSerializer.Serialize(item);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> SaveContactFormAsync(ContactForm item)
        {
            var workContent = await _context.WorkContents.FindAsync(item.Id);
            if (workContent is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Work content not found!"
                });
            }
            workContent.Arguments = JsonSerializer.Serialize(item);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> SaveRowAsync(Row row)
        {
            var workContent = await _context.WorkContents.FindAsync(row.Id);
            if (workContent is null)
            {
                return IdentityResult.Failed();
            }
            workContent.Arguments = JsonSerializer.Serialize(row);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> SaveTagAsync(Tag tag)
        {
            var work = await _context.WorkContents.FindAsync(tag.Id);
            if (work is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Data not found!"
                });
            }
            work.Arguments = JsonSerializer.Serialize(tag);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IEnumerable<Option>> TagListAsync(WorkFilterOptions filterOptions)
        {
            var query = from a in _context.Components
                        join b in _context.WorkContents on a.Id equals b.ComponentId
                        where a.NormalizedName.Equals(nameof(Tag))
                        orderby b.Name ascending
                        select new Option
                        {
                            Label = b.Name,
                            Value = b.Id
                        };
            return await query.Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync();
        }

        public async Task<IEnumerable<WorkContent>> GetWorkContentChildsAsync(Guid parentId)
        {
            return await _context.WorkContents.Where(x => x.Active && x.ParentId == parentId).OrderByDescending(x => x.Id).ToListAsync();
        }

        public async Task<IdentityResult> SaveAsync(WorkContent args)
        {
            var work = await FindAsync(args.Id);
            if (work == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "general.dataNotFound",
                    Description = "Work not found"
                });
            }
            work.Active = args.Active;
            work.Name = args.Name;
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task AddAsync(WorkContent workContent)
        {
            await _context.AddAsync(workContent);
            await _context.SaveChangesAsync();
        }

        public async Task AddItemAsync(WorkItem workItem)
        {
            await _context.WorkItems.AddAsync(workItem);
            await _context.SaveChangesAsync();
        }

        public async Task<IdentityResult> SaveArgumentsAsync(Guid id, object args)
        {
            var work = await _context.WorkContents.FindAsync(id);
            if (work == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Data not found"
                });
            }
            work.Arguments = JsonSerializer.Serialize(args);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<WorkContent?> GetSummaryAsync(Guid id)
        {
            return await _context.WorkContents.Select(x => new WorkContent
            {
                Active = x.Active,
                Name = x.Name,
                ComponentId = x.ComponentId,
                Id = x.Id,
                ParentId = x.ParentId
            }).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IdentityResult> UpdateSummaryAsync(WorkContent args)
        {
            var work = await _context.WorkContents.FindAsync(args.Id);
            if (work == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Data not found!"
                });
            }
            work.Active = args.Active;
            work.Name = args.Name;
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> ItemDeleteAsync(WorkItem args)
        {
            var data = await _context.WorkItems.FirstOrDefaultAsync(x => x.CatalogId == args.CatalogId && x.WorkId == args.WorkId);
            if (data is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Data not found"
                });
            }
            _context.WorkItems.Remove(data);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
    }
}
