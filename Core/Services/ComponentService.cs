using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services
{
    public class ComponentService : IComponentService
    {
        private readonly ApplicationDbContext _context;
        public ComponentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IdentityResult> ActiveAsync(Guid id)
        {
            var component = await _context.Components.FindAsync(id);
            if (component == null)
            {
                return IdentityResult.Failed();
            }
            component.Active = !component.Active;
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(Guid id)
        {
            var component = await FindAsync(id);
            if (component is null)
            {
                return IdentityResult.Failed();
            }
            if (!await HasWorkContentAsync(id))
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Has work content!"
                });
            }
            _context.Remove(component);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<Component> EnsureComponentAsync(string normalizedName)
        {
            var component = await _context.Components.FirstOrDefaultAsync(x => x.NormalizedName.ToLower().Equals(normalizedName.ToLower()));
            if (component is null)
            {
                component = new Component
                {
                    NormalizedName = normalizedName,
                    Name = normalizedName,
                    Active = true
                };
                await _context.SaveChangesAsync();
            }
            return component;
        }

        public async Task<Component?> FindAsync(Guid id) => await _context.Components.FindAsync(id);

        public async Task<Component?> GetByNameAsync(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return default;
            }
            return await _context.Components.FirstOrDefaultAsync(x => x.NormalizedName.ToLower().Equals(name.ToLower()));
        }

        public async Task<bool> HasWorkContentAsync(Guid id) => await _context.WorkContents.AnyAsync(x => x.ComponentId == id);

        public async Task<IEnumerable<Component>> ListAllAsync() => await _context.Components.Where(x => x.Active).OrderBy(x => x.NormalizedName).ToListAsync();

        public async Task<ListResult<Component>> ListAsync(IFilterOptions filterOptions)
        {
            var query = _context.Components.OrderBy(x => x.NormalizedName);
            return await ListResult<Component>.Success(query, filterOptions);
        }

        public async Task<ListResult<WorkListItem>> ListWorkAsync(Guid id, WorkFilterOptions filterOptions)
        {
            var query = from a in _context.WorkContents
                        join b in _context.Components on a.ComponentId equals b.Id
                        where b.Id == id
                        orderby a.Id ascending
                        select new WorkListItem
                        {
                            Active = a.Active,
                            Name = a.Name,
                            NormalizedName = b.NormalizedName,
                            Id = a.Id
                        };
            return await ListResult<WorkListItem>.Success(query, filterOptions);
        }
    }
}
