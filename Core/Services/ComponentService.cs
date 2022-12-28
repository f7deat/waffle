using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Core.Services
{
    public class ComponentService : IComponentService
    {
        private readonly ApplicationDbContext _context;
        public ComponentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Component?> GetByNameAsync(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return default;
            }
            return await _context.Components.FirstOrDefaultAsync(x => x.NormalizedName.ToLower().Equals(name.ToLower()));
        }
    }
}
