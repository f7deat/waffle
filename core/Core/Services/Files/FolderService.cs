using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities.Files;
using Waffle.Models.Result;

namespace Waffle.Core.Services.Files;

public class FolderService(ApplicationDbContext context) : IFolderService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<DefResult> AddAsync(Folder args)
    {
        if (await _context.Folders.AnyAsync(x => x.Name == args.Name)) return DefResult.Failed("Folder existed!");
        args.CreatedDate = DateTime.Now;
        await _context.Folders.AddAsync(args);
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }
}
