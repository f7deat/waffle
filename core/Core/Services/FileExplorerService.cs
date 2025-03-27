using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Files.Models;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services;

public class FileExplorerService(ApplicationDbContext context, IFileRepository _fileRepository) : IFileService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<int> CountAsync() => await _fileRepository.CountAsync();

    public Task<FileContent?> FindAsync(Guid id) => _fileRepository.FindAsync(id);

    public Task<decimal> GetTotalSizeAsync() => _fileRepository.GetTotalSizeAsync();

    public Task<ListResult<FileAndFolderListItem>> ListAsync(FileFilterOptions filterOptions) => _fileRepository.ListAsync(filterOptions);

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
}
