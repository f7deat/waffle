using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Waffle.Entities.Users;

namespace Waffle.Entities.Commons;

[Index(nameof(Code), IsUnique = true)]
public class SocialPlatform : BaseEntity
{
    [StringLength(40)]
    public string Code { get; set; } = default!;
    [StringLength(100)]
    public string Name { get; set; } = default!;
    public bool IsActive { get; set; }

    public ICollection<SocialAccount>? SocialAccounts { get; set; }
}
