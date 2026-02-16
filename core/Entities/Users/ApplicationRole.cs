using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Users;

public class ApplicationRole : IdentityRole<Guid>
{
    [StringLength(256)]
    public string? DisplayName { get; set; }
}
