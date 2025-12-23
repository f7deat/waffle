using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.IRepositories;
using Waffle.Data;
using Waffle.Entities.Tags;

namespace Waffle.Infrastructure.Repositories;

public class TagRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Tag>(context, hcaService), ITagRepository
{
    public Task<bool> IsExistsAsync(string name) => _context.Tags.AnyAsync(t => t.NormalizedName == name);
}
