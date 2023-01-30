using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services
{
    public class FileExplorerService : IFileExplorerService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public FileExplorerService(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
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

        public async Task<ListResult<FileContent>> ListAsync(FileFilterOptions filterOptions)
        {
            var query = _context.FileContents
                .Where(x => (string.IsNullOrWhiteSpace(filterOptions.Name) || x.Name.ToLower().Contains(filterOptions.Name.ToLower())) && (string.IsNullOrEmpty(filterOptions.Type) || x.Type.Equals(filterOptions.Type.ToLower())))
                .OrderByDescending(x => x.Id);
            return await ListResult<FileContent>.Success(query, filterOptions);
        }

        public async Task<IdentityResult> UploadFromUrlAsync(string url)
        {
            var uri = new Uri(url);
            await _context.FileContents.AddAsync(new FileContent
            {
                Name = Path.GetFileName(uri.LocalPath),
                Url = url,
                Size = 0,
                Type = Path.GetExtension(uri.LocalPath).ToLower()
            });
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task RemoveFromItemAsync(Guid itemId)
        {
            if (!await _context.FileItems.AnyAsync(x => x.ItemId == itemId))
            {
                return;
            }
            var fileItem = await _context.FileItems.FirstAsync(x => x.ItemId == itemId);
            if (await _context.FileItems.CountAsync(x => x.ItemId == itemId) == 1)
            {
                var fileContents = await _context.FileContents.FindAsync(fileItem.FileId);
                if (fileContents != null)
                {
                    var path = Path.Combine(_webHostEnvironment.WebRootPath, fileContents.Url);
                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }
                    _context.FileContents.Remove(fileContents);
                }
            }
            _context.FileItems.Remove(fileItem);
        }
    }
}
