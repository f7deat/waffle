using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IServices;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services
{
    public class FileExplorerService : IFileExplorerService
    {
        private readonly ApplicationDbContext _context;
        public FileExplorerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IdentityResult> DeleteFileItemAsync(FileItem item)
        {
            var fileItem = await _context.FileItems.FirstOrDefaultAsync(x => x.ItemId == item.ItemId && x.FileId == item.FileId);
            if (fileItem is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "File not found!"
                });
            }
            _context.FileItems.Remove(item);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<dynamic> ListAsync(FileFilterOptions filterOptions)
        {
            var query = _context.FileContents.Where(x => string.IsNullOrWhiteSpace(filterOptions.Name) || x.Name.ToLower().Contains(filterOptions.Name.ToLower()));
            return new
            {
                data = await query.OrderByDescending(x => x.Id).Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync(),
                total = await query.CountAsync()
            };
        }
    }
}
