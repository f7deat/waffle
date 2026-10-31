using Waffle.Entities.Locations;

namespace Waffle.Entities.Users;

public class UserActivityArea
{
    public Guid UserId { get; set; }
    public int ProvinceId { get; set; }

    public ApplicationUser? User { get; set; }
    public Province? Province { get; set; }
}
