using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Users;

// 1-1 với ApplicationUser, chỉ dành cho role business
public class BusinessProfile
{
    [Key]
    public Guid UserId { get; set; }
    [StringLength(256)]
    public string? CompanyName { get; set; }
    [StringLength(32)]
    public string? TaxCode { get; set; }
    [StringLength(128)]
    public string? BusinessType { get; set; }
    [StringLength(256)]
    public string? RepresentativeName { get; set; }
    [StringLength(512)]
    public string? Website { get; set; }
    [StringLength(256)]
    public string? ContactEmail { get; set; }
    [StringLength(32)]
    public string? ContactPhone { get; set; }
    [StringLength(512)]
    public string? BusinessAddress { get; set; }
    [StringLength(1024)]
    public string? Description { get; set; }
    public bool IsVerified { get; set; }

    public ApplicationUser? User { get; set; }
}
