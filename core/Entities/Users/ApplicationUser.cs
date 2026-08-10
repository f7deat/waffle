using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Users;

public class ApplicationUser : IdentityUser<Guid>
{
    [StringLength(256)]
    public string? Name { get; set; }
    [StringLength(512)]
    public string? Address { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public bool? Gender { get; set; }
    [Column(TypeName = "money")]
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [StringLength(2058)]
    public string? Avatar { get; set; }
    public int? DistrictId { get; set; }
}
