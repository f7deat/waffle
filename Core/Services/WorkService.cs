using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
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
                Name = column.Name,
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

        public async Task<T?> GetAsync<T>(Guid id)
        {
            var work = await _context.WorkContents.FindAsync(id);
            if (string.IsNullOrEmpty(work?.Arguments))
            {
                return default;
            }
            return JsonSerializer.Deserialize<T>(work.Arguments);
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
    }
}
