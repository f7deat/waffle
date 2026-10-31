using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Users;

public class WalletTopupPayment
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int OrderCode { get; set; }
    [Column(TypeName = "money")]
    public decimal Amount { get; set; }
    [MaxLength(32)]
    public string Status { get; set; } = "Pending";
    [MaxLength(128)]
    public string? PaymentLinkId { get; set; }
    [MaxLength(2048)]
    public string? CheckoutUrl { get; set; }
    [MaxLength(512)]
    public string? Note { get; set; }
    [MaxLength(128)]
    public string? ProviderReference { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? PaidAt { get; set; }
}
