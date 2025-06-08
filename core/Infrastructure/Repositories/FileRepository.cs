using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Files.Models;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories;

public class FileRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<FileContent>(context, hcaService), IFileRepository
{
    public async Task<decimal> GetTotalSizeAsync() => await _context.FileContents.SumAsync(x => x.Size);

    public async Task<ListResult<FileAndFolderListItem>> ListAsync(FileFilterOptions filterOptions)
    {
        var total = 0;
        var data = new List<FileAndFolderListItem>();
        var folderQuery = _context.Folders.OrderByDescending(x => x.CreatedDate).Where(x => filterOptions.ParentId == null || x.ParentId == filterOptions.ParentId).Select(x => new FileAndFolderListItem
        {
            Id = x.Id,
            Name = x.Name,
            Size = _context.FileContents.Where(s => s.FolderId == x.Id).Sum(s => s.Size),
            CreatedDate = x.CreatedDate,
            IsFolder = true,
        });

        var folders = await folderQuery.Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync();
        total = await folderQuery.CountAsync();

        data.AddRange(folders);

        filterOptions.PageSize -= total;
        if (filterOptions.PageSize > 0)
        {
            var fileQuery = _context.FileContents.OrderByDescending(x => x.UploadDate).Where(x => filterOptions.FolderId == null || x.FolderId == filterOptions.FolderId).Select(x => new FileAndFolderListItem
            {
                Id = x.Id,
                Name = x.Name,
                Size = x.Size,
                CreatedDate = x.UploadDate,
                IsFolder = false,
            });

            var files = await fileQuery.Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync();

            total += await fileQuery.CountAsync();

            data.AddRange(files);
        }

        return new ListResult<FileAndFolderListItem>
        {
            Total = total,
            Data = data
        };
    }
}
