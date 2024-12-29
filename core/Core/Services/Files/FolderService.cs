using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities.Files;
using Waffle.Models.Filters.Folders;
using Waffle.Models.Result;

namespace Waffle.Core.Services.Files;

public class FolderService(ApplicationDbContext context, ICurrentUser currentUser, ILookupNormalizer lookupNormalizer) : IFolderService
{
    private readonly ApplicationDbContext _context = context;
    private readonly ICurrentUser _currentUser = currentUser;
    private readonly ILookupNormalizer _lookupNormalizer = lookupNormalizer;

    public async Task<DefResult> AddAsync(Folder args, string locale)
    {
        if (await _context.Folders.AnyAsync(x => x.Name == args.Name && x.Locale == locale)) return DefResult.Failed("Folder existed!");
        if (args.ParentId != null && !await _context.Folders.AnyAsync(x => x.ParentId == args.ParentId)) return DefResult.Failed("Parent folder not found!");
        args.CreatedDate = DateTime.Now;
        args.Locale = locale;
        args.CreatedBy = _currentUser.GetId();
        args.NormalizedName = _lookupNormalizer.NormalizeName(args.Name).ToLower().Replace(" ", "-");
        await _context.Folders.AddAsync(args);
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }

    public async Task<DefResult> DeleteAsync(Guid id)
    {
        var folder = await _context.Folders.FindAsync(id);
        if (folder is null) return DefResult.Failed("Folder not found!");
        if (await _context.Folders.AnyAsync(x => x.ParentId == id)) return DefResult.Failed("Please remove child folders!");
        if (await _context.FileContents.AnyAsync(x => x.FolderId == id)) return DefResult.Failed("Please remove files!");
        _context.Folders.Remove(folder);
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }

    public async Task<object?> ListAsync(FolderFilterOptions filterOptions)
    {
        var query = from a in _context.Folders
                    where a.ParentId == filterOptions.ParentId && a.Locale == filterOptions.Locale
                    select new
                    {
                        a.Id,
                        a.ParentId,
                        a.Name,
                        a.CreatedDate,
                        a.CreatedBy,
                        a.ModifiedDate,
                        a.ModifiedBy,
                        fileCount = _context.FileContents.Count(x => x.FolderId == a.Id)
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.Name.Contains(filterOptions.Name, StringComparison.CurrentCultureIgnoreCase));
        }
        return new
        {
            data = await query.OrderByDescending(x => x.Name).Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync(),
            total = await query.CountAsync()
        };
    }

    public async Task<DefResult> UpdateAsync(Folder args)
    {
        var folder = await _context.Folders.FindAsync(args.Id);
        if (folder is null) return DefResult.Failed("Folder not found!");
        if (await _context.Folders.AnyAsync(x => x.Name == args.Name)) return DefResult.Failed("Folder existed!");
        folder.Name = args.Name;
        folder.NormalizedName = _lookupNormalizer.NormalizeName(folder.Name).ToLower().Replace(" ", "-");
        folder.ModifiedBy = _currentUser.GetId();
        folder.ModifiedDate = DateTime.Now;
        _context.Folders.Update(folder);
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }
}
