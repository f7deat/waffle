using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using Waffle.Core.Interfaces.IServices;
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
