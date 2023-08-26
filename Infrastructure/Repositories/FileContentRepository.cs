using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories;

public class FileContentRepository : EfRepository<FileContent>, IFileContentRepository
{
    public FileContentRepository(ApplicationDbContext context) : base(context)
    {
    }
}
