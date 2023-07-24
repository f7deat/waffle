using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;

namespace Waffle.Data.ContentGenerators
{
    public class LeafGenerator : BaseGenerator
    {
        public LeafGenerator(ApplicationDbContext context) : base(context)
        {
            
        }

        public async Task EnsurePricingAsync()
        {
            var pricing = await _context.Catalogs.FirstOrDefaultAsync();
            var a = 2;
        }

        public override async Task RunAsync()
        {
            await EnsurePricingAsync();
        }
    }
}
