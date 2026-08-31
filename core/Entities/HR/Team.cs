using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Waffle.Entities.Users;

namespace Waffle.Entities.HR;

public class Team : BaseEntity<int>
{
    [Required, StringLength(256)]
    public string Name { get; set; } = default!;
    [ForeignKey(nameof(Department))]
    public int DepartmentId { get; set; }

    public Department? Department { get; set; }
    public ICollection<ApplicationUser> Members { get; set; } = [];
}
