using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Files.Filters;
using Waffle.Data;
using Waffle.Entities.Files;

namespace Waffle.Core.Services.Files;

public class FolderService(ApplicationDbContext _context, IHCAService _hcaService, ILookupNormalizer _lookupNormalizer) : IFolderService
{
    public async Task<TResult> AddAsync(Folder args, string locale)
    {
        if (await _context.Folders.AnyAsync(x => x.Name == args.Name && x.Locale == locale)) return TResult.Failed("Folder existed!");
        if (args.ParentId != null && !await _context.Folders.AnyAsync(x => x.ParentId == args.ParentId)) return TResult.Failed("Parent folder not found!");
        args.CreatedDate = DateTime.Now;
        args.Locale = locale;
        args.CreatedBy = _hcaService.GetUserId();
        args.NormalizedName = _lookupNormalizer.NormalizeName(args.Name).ToLower().Replace(" ", "-");
        await _context.Folders.AddAsync(args);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var folder = await _context.Folders.FindAsync(id);
        if (folder is null) return TResult.Failed("Folder not found!");
        if (await _context.Folders.AnyAsync(x => x.ParentId == id)) return TResult.Failed("Please remove child folders!");
        if (await _context.FileContents.AnyAsync(x => x.FolderId == id)) return TResult.Failed("Please remove files!");
        _context.Folders.Remove(folder);
        await _context.SaveChangesAsync();
        return TResult.Success;
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

    public async Task<TResult> UpdateAsync(Folder args)
    {
        var folder = await _context.Folders.FindAsync(args.Id);
        if (folder is null) return TResult.Failed("Folder not found!");
        if (await _context.Folders.AnyAsync(x => x.Name == args.Name)) return TResult.Failed("Folder existed!");
        folder.Name = args.Name;
        folder.NormalizedName = _lookupNormalizer.NormalizeName(folder.Name).ToLower().Replace(" ", "-");
        folder.ModifiedBy = _hcaService.GetUserId();
        folder.ModifiedDate = DateTime.Now;
        _context.Folders.Update(folder);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }
}
