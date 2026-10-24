using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Data;
using Waffle.Entities.Users;
using Waffle.Models;
using Waffle.Modules.Users.Interfaces;

namespace Waffle.Modules.Users.Repositories;

public class UserRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<ApplicationUser>(context, hcaService), IUserRepository
{
    public async Task<ListResult> GetRandomInfluencersAsync(FilterOptions filterOptions)
    {
        var query = from u in _context.Users
                    join ur in _context.UserRoles on u.Id equals ur.UserId
                    join r in _context.Roles on ur.RoleId equals r.Id
                    join d in _context.Districts on u.DistrictId equals d.Id into districts
                    from d in districts.DefaultIfEmpty()
                    join p in _context.Provinces on d.ProvinceId equals p.Id into provinces
                    from p in provinces.DefaultIfEmpty()
                    where r.Name == RoleName.Influencer
                    select new
                    {
                        u.Id,
                        u.UserName,
                        u.Name,
                        u.Bio,
                        u.Avatar,
                        ProvinceId = (int?)d.ProvinceId,
                        ProvinceName = p.Name,
                        PlaceCount = _context.Places.Count(pl => pl.InfluencerId == u.Id),
                    };
        query = query.OrderBy(u => Guid.NewGuid());
        return await ListResult.Success(query, filterOptions);
    }
}
