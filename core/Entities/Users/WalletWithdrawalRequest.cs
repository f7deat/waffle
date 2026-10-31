using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Users;

public class WalletWithdrawalRequest
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    [Column(TypeName = "money")]
    public decimal Amount { get; set; }
    [MaxLength(100)]
    public string BankName { get; set; } = default!;
    [MaxLength(128)]
    public string AccountHolder { get; set; } = default!;
    [MaxLength(1024)]
    public string ProtectedAccountNumber { get; set; } = default!;
    [MaxLength(64)]
    public string InvoiceNumber { get; set; } = default!;
    [MaxLength(32)]
    public string Status { get; set; } = "Pending";
    [MaxLength(512)]
    public string? Note { get; set; }
    [MaxLength(512)]
    public string? AdminNote { get; set; }
    public Guid? ResolvedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
