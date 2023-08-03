using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories
{
    public class WorkItemRepository : EfRepository<WorkContent>, IWorkContentRepository
    {
        public WorkItemRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
