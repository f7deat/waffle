using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.HR;

public class Department : BaseEntity<int>
{
    [Required, StringLength(256)]
    public string Name { get; set; } = default!;
    [ForeignKey(nameof(Branch))]
    public int BranchId { get; set; }

    public Branch? Branch { get; set; }
    public ICollection<Team>? Teams { get; set; }
}
