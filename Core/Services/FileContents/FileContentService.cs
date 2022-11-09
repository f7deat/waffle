using Microsoft.EntityFrameworkCore;
using Waffle.Data;

namespace Waffle.Core.Services.FileContents
{
    public class FileContentService : IFileContentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public FileContentService(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
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
