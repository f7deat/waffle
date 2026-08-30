using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.HR;

public class Branch : BaseEntity<int>
{
    [Required, StringLength(256)]
    public string Name { get; set; } = default!;
    [StringLength(500)]
    public string? Address { get; set; }
    [StringLength(50)]
    public string? Phone { get; set; }
    [StringLength(256)]
    public string? Email { get; set; }

    public ICollection<Department>? Departments { get; set; }
}
