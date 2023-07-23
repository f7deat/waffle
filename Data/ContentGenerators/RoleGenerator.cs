using Waffle.Core.Constants;
using Waffle.Entities;

namespace Waffle.Data.ContentGenerators;

public class RoleGenerator
{
    public static IEnumerable<ApplicationRole> GetData()
    {
        var roles = new List<ApplicationRole>
        {
            new ApplicationRole
            {
                Name = RoleName.Admin
            }
        };
        return roles;
    }
}
