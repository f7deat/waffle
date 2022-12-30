using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.Core.Services
{
    public class WorkService : IWorkService
    {
        private readonly ApplicationDbContext _context;
        public WorkService(ApplicationDbContext context)
        {
            _context = context;
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

        public async Task<IdentityResult> DeleteAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent == null)
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

        public T? Get<T>(string content) => JsonSerializer.Deserialize<T>(content);

        public async Task<Column?> GetColumnAsync(Guid id)
        {
            var work = await _context.WorkContents.FindAsync(id);
            if (work is null || string.IsNullOrEmpty(work.Arguments))
            {
                return default;
            }
            return Get<Column>(work.Arguments);
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
            work.Name = item.ClassName;
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
