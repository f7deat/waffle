using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.IRepositories;
using Waffle.Data;
using Waffle.Entities.Tags;
using Waffle.Models;
using Waffle.Models.Components.Common;

namespace Waffle.Infrastructure.Repositories;

public class TagRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Tag>(context, hcaService), ITagRepository
{
    public async Task<IEnumerable<Option>> GetTagOptionsAsync(SelectOptions selectOptions)
    {
        return await _context.Tags
            .Where(t => string.IsNullOrEmpty(selectOptions.KeyWords) || t.NormalizedName.Contains(selectOptions.KeyWords))
            .OrderBy(t => t.Name)
            .Select(t => new Option
            {
                Label = t.Name,
                Value = t.Id
            })
            .ToListAsync();
    }

    public Task<bool> IsExistsAsync(string name) => _context.Tags.AnyAsync(t => t.NormalizedName == name);
}
