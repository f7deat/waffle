using Waffle.Entities.Tags;

namespace Waffle.Entities.Users;

public class UserTag
{
    public Guid UserId { get; set; }
    public Guid TagId { get; set; }

    public ApplicationUser? User { get; set; }
    public Tag? Tag { get; set; }
}
