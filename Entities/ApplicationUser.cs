using Microsoft.AspNetCore.Identity;

namespace Waffle.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? Name { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public bool? Gender { get; set; }
}
