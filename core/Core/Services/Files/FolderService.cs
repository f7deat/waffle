using Waffle.Core.Interfaces.IService;
using Waffle.Data;

namespace Waffle.Core.Services.Files;

public class FolderService : IFolderService
{
    private readonly ApplicationDbContext _context;
    public FolderService(ApplicationDbContext context)
    {
        _context = context;
    }
}
