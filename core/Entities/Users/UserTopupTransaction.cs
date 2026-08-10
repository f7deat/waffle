using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Users;

public class UserTopupTransaction
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    [Column(TypeName = "money")]
    public decimal Amount { get; set; }
    [Column(TypeName = "money")]
    public decimal BalanceBefore { get; set; }
    [Column(TypeName = "money")]
    public decimal BalanceAfter { get; set; }
    [StringLength(64)]
    public string InvoiceNumber { get; set; } = default!;
    [StringLength(512)]
    public string? Note { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
