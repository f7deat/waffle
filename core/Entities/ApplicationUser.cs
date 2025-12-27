using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    [StringLength(256)]
    public string? Name { get; set; }
    [StringLength(512)]
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public bool? Gender { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }
    [StringLength(2058)]
    public string? Avatar { get; set; }
    public int? DistrictId { get; set; }
}
