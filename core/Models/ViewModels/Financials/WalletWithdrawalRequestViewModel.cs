namespace Waffle.Models.ViewModels.Financials;

public class WalletWithdrawalRequestViewModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public decimal Amount { get; set; }
    public string BankName { get; set; } = default!;
    public string AccountHolder { get; set; } = default!;
    public string AccountNumber { get; set; } = default!;
    public string InvoiceNumber { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string? Note { get; set; }
    public string? AdminNote { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
